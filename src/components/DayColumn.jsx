export default function DayColumn({ day, morning, afternoon, onAssignClick }) {
  const totalGroups = (morning?.length || 0) + (afternoon?.length || 0);

  const renderList = (groups) => {
    if (!groups || groups.length === 0) {
      return (
        <span className="text-xs text-gray-500 italic">
          Disponible
        </span>
      );
    }

    return (
      <div className="space-y-1">
        {groups.map((g, idx) => (
          <div
            key={`${g.code}-${g.section}-${idx}`}
            className="text-xs bg-white/80 px-2 py-1 rounded-full border border-[#3D5A9E]/30 text-[#003566] font-semibold flex items-center justify-between"
          >
            <span>
              {g.code}-{g.section}
            </span>
            {g.max_capacity && (
              <span className="ml-2 text-[10px] text-gray-500">
                {g.max_capacity} estudiantes
              </span>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-4 flex flex-col gap-4 border border-[#B8C9DC]/60">
      {/* Header del día */}
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-bold text-[#003566] uppercase tracking-wide">
          {day}
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          {totalGroups === 0
            ? "Sin grupos asignados"
            : `${totalGroups} grupo(s) asignado(s)`}
        </p>
      </div>

      {/* Turno mañana */}
      <div className="bg-[#F5F7FB] rounded-xl p-3 border border-[#B8C9F5]">
        <p className="text-xs font-semibold text-[#3D5A9E] uppercase mb-1">
          Mañana (8:00 - 13:00)
        </p>
        {renderList(morning)}
      </div>

      {/* Turno tarde */}
      <div className="bg-[#FFF7E0] rounded-xl p-3 border border-[#F2D28B]">
        <p className="text-xs font-semibold text-[#8B5A00] uppercase mb-1">
          Tarde (14:30 - 18:20)
        </p>
        {renderList(afternoon)}
      </div>

      {/* Botón Asignar */}
      <button
        type="button"
        onClick={onAssignClick}
        className="mt-2 w-full rounded-full bg-[#ffd60a] text-[#003566] py-2 text-sm font-semibold hover:bg-[#ffec4e] transition-colors"
      >
        Asignar grupos a este día
      </button>
    </div>
  );
}
