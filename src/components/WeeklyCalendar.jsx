import { useEffect, useState } from "react";
import DayColumn from "./DayColumn";
import AssignScheduleModal from "./AssignScheduleModal";
import AssignAutoScheduleModal from "./AssignAutoScheduleModal";

import {
    getAllClassrooms,
    assignClassroomSchedule,
    assignClassroomAuto,
} from "../shared/api/ClassroomApi";

const weekdays = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

// Convierte semana ISO + día → YYYY-MM-DD
function getDateOfISOWeek(weekString, weekdayName) {
    if (!weekString || !weekdayName) return null;

    const [yearStr, weekStr] = weekString.split("-W");
    const year = parseInt(yearStr, 10);
    const week = parseInt(weekStr, 10);

    const weekdayIndex = {
        Lunes: 1,
        Martes: 2,
        Miércoles: 3,
        Jueves: 4,
        Viernes: 5,
    }[weekdayName];

    if (!weekdayIndex) return null;

    const simple = new Date(year, 0, 1 + (week - 1) * 7);
    const dow = simple.getDay();

    const ISOweekStart = new Date(simple);
    if (dow <= 4) ISOweekStart.setDate(simple.getDate() - dow + 1);
    else ISOweekStart.setDate(simple.getDate() + (8 - dow));

    ISOweekStart.setDate(ISOweekStart.getDate() + (weekdayIndex - 1));

    return ISOweekStart.toISOString().substring(0, 10);
}

// Determina si el turno es mañana o tarde
function getTurnFromClassroom(classroom) {
    if (!classroom.start_datetime) return null;
    const hour = new Date(classroom.start_datetime).getHours();
    return hour < 14 ? "mañana" : "tarde";
}

export default function WeeklyCalendar() {
    const [week, setWeek] = useState("");
    const [classrooms, setClassrooms] = useState([]);
    const [selectedDay, setSelectedDay] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAutoModalOpen, setIsAutoModalOpen] = useState(false);

    // Cargar classrooms al inicio
    useEffect(() => {
        loadClassrooms();
    }, []);

    const loadClassrooms = async () => {
        const data = await getAllClassrooms();
        setClassrooms(data);
    };

    // Abrir modal manual
    const openAssignModal = (day) => {
        if (!week) {
            alert("Debe seleccionar una semana primero.");
            return;
        }
        setSelectedDay(day);
        setIsModalOpen(true);
    };

    // Abrir modal automático
    const openAutoAssignModal = (day) => {
        if (!week) {
            alert("Seleccione una semana primero.");
            return;
        }
        setSelectedDay(day);
        setIsAutoModalOpen(true);
    };

    // Confirmación de asignación manual
    const handleConfirmAssignment = async (assignments) => {
        const realDate = getDateOfISOWeek(week, selectedDay);

        if (!realDate) {
            alert("No se pudo calcular la fecha.");
            return;
        }

        await assignClassroomSchedule({
            week,
            date: realDate,
            assignments,
        });

        await loadClassrooms();
        setIsModalOpen(false);
    };

    // Confirmación de asignación automática
    const handleConfirmAuto = async (selectedCode) => {
        await assignClassroomAuto({
            week,
            weekday: selectedDay,
            code: selectedCode,
        });

        await loadClassrooms();
        setIsAutoModalOpen(false);
    };

    // Classroom sin asignación (para el modal manual)
    const unscheduledGroups = classrooms.filter(
        (c) => !c.start_datetime && !c.end_datetime
    );

    // Agrupados por ciclo (para modal automático)
    const groupsByCycle = classrooms.reduce((acc, cls) => {
        if (!cls.start_datetime) {
            if (!acc[cls.code]) acc[cls.code] = [];
            acc[cls.code].push(cls);
        }
        return acc;
    }, {});

    return (
        <div className="p-6 w-full">
            <h1 className="text-2xl font-bold text-[#003566] mb-4">
                Agenda semanal de classrooms
            </h1>

            {/* Selector de semana */}
            <div className="mb-6">
                <label className="font-semibold block mb-2 text-lg">
                    Seleccionar semana:
                </label>
                <input
                    type="week"
                    value={week}
                    onChange={(e) => setWeek(e.target.value)}
                    className="border px-4 py-2 rounded-lg text-gray-700 w-60"
                />
            </div>

            {/* Vista semanal */}
            <div className="grid md:grid-cols-5 gap-4">
                {weekdays.map((day) => {
                    const targetDate = getDateOfISOWeek(week, day);

                    const assignedToday = classrooms.filter((c) => {
                        if (!c.start_datetime) return false;
                        return c.start_datetime.substring(0, 10) === targetDate;
                    });

                    const morning = assignedToday.filter(
                        (c) => getTurnFromClassroom(c) === "mañana"
                    );
                    const afternoon = assignedToday.filter(
                        (c) => getTurnFromClassroom(c) === "tarde"
                    );

                    return (
                        <DayColumn
                            key={day}
                            day={day}
                            morning={morning}
                            afternoon={afternoon}
                            onAssignClick={() => openAssignModal(day)}
                            onAutoAssignClick={() => openAutoAssignModal(day)}
                        />
                    );
                })}
            </div>

            {/* Modal de asignación manual */}
            <AssignScheduleModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmAssignment}
                week={week}
                weekday={selectedDay}
                groups={unscheduledGroups}
            />

            {/* Modal de asignación automática */}
            <AssignAutoScheduleModal
                isOpen={isAutoModalOpen}
                onClose={() => setIsAutoModalOpen(false)}
                onConfirm={handleConfirmAuto}
                week={week}
                weekday={selectedDay}
                groupsByCycle={groupsByCycle}
            />
        </div>
    );
}
