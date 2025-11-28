import { useState, useEffect } from 'react';
import { Mail, Send, Plus, X, CheckCircle, AlertCircle, Settings, Users, School } from 'lucide-react';
import { invitationApi } from '../shared/api/invitationApi';
import { classroomApi } from '../shared/api/classroomApi';
import { challengesApi } from '../shared/api/ChallengesApi';
import { criterionApi } from '../shared/api/CriterionApi';
import { studentsApi } from '../shared/api/studentsApi';
import Toast from '../widgets/Toast';

export default function Invitations() {
  const [recipients, setRecipients] = useState(['']);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  
  // Detalles del evento
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventShift, setEventShift] = useState('');
  const [eventClassroom, setEventClassroom] = useState('');
  const [challengeName, setChallengeName] = useState('');
  const [criteria, setCriteria] = useState('');
  
  // Classrooms
  const [classrooms, setClassrooms] = useState([]);
  const [loadingClassrooms, setLoadingClassrooms] = useState(false);
  
  // Retos y Criterios
  const [challenges, setChallenges] = useState([]);
  const [criteriaList, setCriteriaList] = useState([]);
  const [selectedChallengeId, setSelectedChallengeId] = useState('');
  const [selectedCriteriaIds, setSelectedCriteriaIds] = useState([]);
  
  // Autenticación con Google
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);
  
  // Método alternativo: credenciales directas
  const [useDirectCredentials, setUseDirectCredentials] = useState(true);
  const [senderEmail, setSenderEmail] = useState('');
  const [senderPassword, setSenderPassword] = useState('');
  
  // Estudiantes
  const [students, setStudents] = useState([]);
  const [showStudents, setShowStudents] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  
  // Filtro por classroom
  const [selectedClassroomFilter, setSelectedClassroomFilter] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);
  
  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    checkAuthStatus();
    loadStudents();
    loadClassrooms();
    loadChallenges();
    loadCriteria();
    
    // Verificar si viene de un callback de OAuth
    const urlParams = new URLSearchParams(window.location.search);
    const authStatus = urlParams.get('auth');
    if (authStatus === 'success') {
      setResult({ success: true, message: 'Autenticación exitosa' });
      checkAuthStatus();
      setUseDirectCredentials(false);
      // Limpiar URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (authStatus === 'error') {
      const errorMsg = urlParams.get('message');
      setResult({ success: false, error: errorMsg || 'Error en la autenticación' });
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
      const status = await invitationApi.getAuthStatus();
      setIsAuthenticated(status.authenticated);
      setUserEmail(status.email || '');
      if (status.authenticated) {
        setUseDirectCredentials(false);
      }
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const response = await invitationApi.getAuthUrl();
      // Redirigir a la URL de autorización de Google
      window.location.href = response.authorization_url;
    } catch (error) {
      setResult({ success: false, error: 'Error al iniciar sesión con Google. Asegúrate de que el backend esté configurado correctamente.' });
      console.error('Error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await invitationApi.logout();
      setIsAuthenticated(false);
      setUserEmail('');
      setUseDirectCredentials(true);
      setResult({ success: true, message: 'Sesión cerrada exitosamente' });
    } catch (error) {
      setResult({ success: false, error: error.message });
    }
  };

  const loadStudents = async () => {
    try {
      const response = await invitationApi.getStudentEmails();
      setStudents(response.students || []);
      setFilteredStudents(response.students || []);
    } catch (error) {
      console.error('Error al cargar estudiantes:', error);
    }
  };

  const loadStudentsByClassroom = async (classroomValue) => {
    if (!classroomValue) {
      setFilteredStudents(students);
      return;
    }

    try {
      const [code, section] = classroomValue.split('-');
      const classroomStudents = await studentsApi.getByClassroom(code, section);
      
      // Filtrar solo estudiantes con email
      const studentsWithEmail = classroomStudents.filter(s => s.email && s.email.trim() !== '');
      setFilteredStudents(studentsWithEmail);
      
      if (studentsWithEmail.length === 0) {
        showToast('No hay estudiantes con correo en esta aula', 'info');
      }
    } catch (error) {
      console.error('Error al cargar estudiantes por aula:', error);
      showToast('Error al cargar estudiantes del aula', 'error');
      setFilteredStudents([]);
    }
  };

  const handleClassroomFilterChange = (classroomValue) => {
    setSelectedClassroomFilter(classroomValue);
    loadStudentsByClassroom(classroomValue);
  };

  const loadClassrooms = async () => {
    try {
      setLoadingClassrooms(true);
      const data = await classroomApi.getActive();
      setClassrooms(data);
    } catch (error) {
      console.error('Error al cargar classrooms:', error);
    } finally {
      setLoadingClassrooms(false);
    }
  };

  const loadChallenges = async () => {
    try {
      const data = await challengesApi.getAll();
      setChallenges(data.filter(c => c.status === 'A'));
    } catch (error) {
      console.error('Error al cargar retos:', error);
    }
  };

  const loadCriteria = async () => {
    try {
      const data = await criterionApi.getAll();
      setCriteriaList(data.filter(c => c.status === 'A'));
    } catch (error) {
      console.error('Error al cargar criterios:', error);
    }
  };

  const toggleStudent = (student) => {
    const isSelected = selectedStudents.some(s => s.id === student.id);
    if (isSelected) {
      setSelectedStudents(selectedStudents.filter(s => s.id !== student.id));
    } else {
      setSelectedStudents([...selectedStudents, student]);
    }
  };

  const addSelectedStudents = () => {
    const newEmails = selectedStudents.map(s => s.email);
    const currentEmails = recipients.filter(email => email.trim() !== '');
    const allEmails = [...new Set([...currentEmails, ...newEmails])];
    setRecipients(allEmails.length > 0 ? allEmails : ['']);
    setSelectedStudents([]);
    setShowStudents(false);
  };

  const addRecipient = () => {
    setRecipients([...recipients, '']);
  };

  const removeRecipient = (index) => {
    const newRecipients = recipients.filter((_, i) => i !== index);
    setRecipients(newRecipients.length > 0 ? newRecipients : ['']);
  };

  const updateRecipient = (index, value) => {
    const newRecipients = [...recipients];
    newRecipients[index] = value;
    setRecipients(newRecipients);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      // Validar autenticación o credenciales
      if (useDirectCredentials) {
        if (!senderEmail || !senderPassword) {
          alert('Por favor ingresa tu correo y contraseña de aplicación');
          setLoading(false);
          return;
        }
        if (!senderEmail.endsWith('@vallegrande.edu.pe')) {
          alert('El correo del remitente debe ser @vallegrande.edu.pe');
          setLoading(false);
          return;
        }
      } else if (!isAuthenticated) {
        alert('Por favor inicia sesión con Google o usa credenciales directas');
        setLoading(false);
        return;
      }

      const validRecipients = recipients.filter(email => email.trim() !== '');
      
      if (validRecipients.length === 0) {
        alert('Agrega al menos un destinatario');
        setLoading(false);
        return;
      }

      // Validar que todos los correos terminen con @vallegrande.edu.pe
      const invalidEmails = validRecipients.filter(email => !email.endsWith('@vallegrande.edu.pe'));
      if (invalidEmails.length > 0) {
        alert(`Los siguientes correos no son válidos (deben terminar con @vallegrande.edu.pe):\n${invalidEmails.join('\n')}`);
        setLoading(false);
        return;
      }

      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
              
              body {
                margin: 0;
                padding: 0;
                font-family: 'Poppins', Arial, sans-serif;
                background: #e8eef5;
              }
              
              .container {
                max-width: 900px;
                margin: 0 auto;
                background: #ffffff;
                overflow: hidden;
              }
              
              .main-wrapper {
                display: table;
                width: 100%;
                background: linear-gradient(135deg, #0a4275 0%, #1a5a8f 50%, #0a4275 100%);
                position: relative;
              }
              
              .tech-grid {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-image: 
                  repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, transparent 1px, transparent 40px, rgba(255,255,255,0.03) 41px),
                  repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px, transparent 1px, transparent 40px, rgba(255,255,255,0.03) 41px);
                opacity: 0.5;
              }
              
              .left-section {
                display: table-cell;
                width: 50%;
                padding: 60px 40px;
                vertical-align: middle;
                position: relative;
                z-index: 10;
              }
              
              .right-section {
                display: table-cell;
                width: 50%;
                padding: 40px;
                vertical-align: middle;
                position: relative;
              }
              
              .logo-badge {
                display: inline-block;
                border: 2px solid rgba(255,255,255,0.3);
                padding: 8px 20px;
                border-radius: 30px;
                margin-bottom: 30px;
              }
              
              .logo-text {
                font-size: 12px;
                font-weight: 600;
                color: #ffffff;
                letter-spacing: 3px;
                text-transform: uppercase;
              }
              
              .main-title {
                font-size: 64px;
                font-weight: 800;
                color: #ffffff;
                line-height: 1;
                margin: 0 0 10px 0;
                text-transform: uppercase;
                letter-spacing: 2px;
              }
              
              .subtitle {
                font-size: 32px;
                font-weight: 300;
                color: #ffffff;
                margin: 0 0 30px 0;
                text-transform: uppercase;
                letter-spacing: 1px;
              }
              
              .event-year {
                font-size: 48px;
                font-weight: 700;
                color: #ffffff;
                margin: 20px 0;
              }
              
              .section-title {
                font-size: 14px;
                font-weight: 700;
                color: #ffffff;
                text-transform: uppercase;
                letter-spacing: 2px;
                margin: 30px 0 15px 0;
                border-left: 4px solid #FFC300;
                padding-left: 15px;
              }
              
              .description {
                font-size: 14px;
                color: rgba(255,255,255,0.85);
                line-height: 1.6;
                margin-bottom: 20px;
              }
              
              .feature-item {
                display: flex;
                align-items: center;
                margin: 12px 0;
                color: #ffffff;
                font-size: 14px;
              }
              
              .check-icon {
                width: 24px;
                height: 24px;
                background: #FFC300;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 12px;
                flex-shrink: 0;
                font-weight: 700;
                color: #0a4275;
              }
              
              .date-box {
                background: rgba(255,255,255,0.15);
                backdrop-filter: blur(10px);
                border: 2px solid rgba(255,255,255,0.2);
                border-radius: 15px;
                padding: 25px;
                text-align: center;
                margin-bottom: 20px;
              }
              
              .date-label {
                font-size: 12px;
                color: rgba(255,255,255,0.8);
                text-transform: uppercase;
                letter-spacing: 2px;
                margin-bottom: 10px;
              }
              
              .date-value {
                font-size: 36px;
                font-weight: 700;
                color: #FFC300;
                margin: 5px 0;
              }
              
              .time-value {
                font-size: 20px;
                font-weight: 600;
                color: #ffffff;
                margin-top: 5px;
              }
              
              .image-circle {
                width: 100%;
                height: 350px;
                border-radius: 50% 0 50% 50%;
                background: linear-gradient(135deg, rgba(255,195,0,0.2) 0%, rgba(255,255,255,0.1) 100%);
                border: 3px solid rgba(255,255,255,0.2);
                overflow: hidden;
                position: relative;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
              }
              
              .dots-pattern {
                position: absolute;
                right: 20px;
                top: 50%;
                transform: translateY(-50%);
              }
              
              .dot {
                width: 8px;
                height: 8px;
                background: rgba(255,255,255,0.4);
                border-radius: 50%;
                margin: 8px 0;
              }
              
              .content-section {
                padding: 50px 60px;
                background: #ffffff;
              }
              
              .content-title {
                font-size: 32px;
                font-weight: 700;
                color: #0a4275;
                margin-bottom: 20px;
              }
              
              .content-text {
                font-size: 16px;
                line-height: 1.8;
                color: #555555;
                margin: 15px 0;
              }
              
              .details-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 20px;
                margin: 30px 0;
              }
              
              .detail-card {
                background: #f8f9fa;
                border-left: 4px solid #FFC300;
                padding: 20px;
                border-radius: 8px;
              }
              
              .detail-label {
                font-size: 12px;
                color: #666;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 8px;
              }
              
              .detail-value {
                font-size: 18px;
                font-weight: 600;
                color: #0a4275;
              }
              
              .criteria-section {
                background: linear-gradient(135deg, #0a4275 0%, #1a5a8f 100%);
                padding: 40px;
                margin: 30px 0;
                border-radius: 15px;
                color: #ffffff;
              }
              
              .criteria-title {
                font-size: 24px;
                font-weight: 700;
                margin-bottom: 20px;
                color: #FFC300;
              }
              
              .criteria-item {
                padding: 12px 0;
                border-bottom: 1px solid rgba(255,255,255,0.1);
                font-size: 15px;
              }
              
              .cta-section {
                text-align: center;
                padding: 40px;
                background: #f8f9fa;
              }
              
              .cta-button {
                display: inline-block;
                background: #FFC300;
                color: #0a4275;
                padding: 18px 60px;
                border-radius: 50px;
                text-decoration: none;
                font-weight: 700;
                font-size: 18px;
                text-transform: uppercase;
                letter-spacing: 1px;
                box-shadow: 0 8px 25px rgba(255, 195, 0, 0.4);
                margin: 20px 0;
              }
              
              .footer {
                background: #f8f9fa;
                padding: 30px 40px;
                text-align: center;
                border-top: 3px solid #859ECA;
              }
              
              .footer-logo {
                font-size: 24px;
                font-weight: 700;
                color: #003566;
                margin-bottom: 15px;
              }
              
              .contact-info {
                font-size: 14px;
                color: #666666;
                margin: 8px 0;
              }
              
              .contact-info a {
                color: #859ECA;
                text-decoration: none;
              }
              
              .footer-note {
                font-size: 12px;
                color: #999999;
                margin-top: 20px;
                line-height: 1.6;
              }
              
              .social-links {
                margin: 20px 0;
              }
              
              .social-links a {
                display: inline-block;
                margin: 0 10px;
                color: #859ECA;
                text-decoration: none;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="main-wrapper">
                <div class="tech-grid"></div>
                
                <div class="left-section">
                  <div class="logo-badge">
                    <div class="logo-text">◇ VALLEGRANDE</div>
                  </div>
                  
                  <div class="main-title">${subject.split(' ')[0] || 'HACKATHON'}</div>
                  <div class="subtitle">${subject.split(' ').slice(1).join(' ') || 'VALLEGRANDE'}</div>
                  <div class="event-year">2025</div>
                  
                  <div class="description">
                    ${message.substring(0, 200)}${message.length > 200 ? '...' : ''}
                  </div>
                  
                  ${challengeName ? `
                  <div style="margin: 25px 0;">
                    <div style="font-size: 12px; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px;">🎯 Reto Principal</div>
                    <div style="font-size: 20px; color: #FFC300; font-weight: 700; line-height: 1.3;">${challengeName}</div>
                  </div>
                  ` : ''}
                  

                </div>
                
                <div class="right-section">
                  <div class="date-box">
                    <div class="date-label">${eventDate ? new Date(eventDate).toLocaleDateString('es-PE', { month: 'long' }).toUpperCase() : 'PRÓXIMAMENTE'}</div>
                    <div class="date-value">${eventDate ? new Date(eventDate).getDate() : 'TBD'}</div>
                    <div class="time-value">${eventTime ? eventTime.substring(0, 5) : '9 AM TO 5 PM'}</div>
                  </div>
                  
                  <div class="image-circle">
                    <div style="width: 100%; height: 100%; background: linear-gradient(135deg, #1a5a8f 0%, #0a4275 100%); display: flex; align-items: center; justify-content: center; padding: 40px; position: relative;">
                      <img src="https://drive.google.com/uc?export=view&id=1FGW91fejyBC7A22ejGai_xh4hEb1SM6B" alt="Robot Vallegrande" style="max-width: 100%; max-height: 100%; object-fit: contain; filter: drop-shadow(0 10px 30px rgba(0,0,0,0.5));" />
                      <div style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); background: rgba(255,195,0,0.9); padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: 700; color: #0a4275; letter-spacing: 1px;">
                        HACKATHON
                      </div>
                    </div>
                  </div>
                  
                  <div class="dots-pattern">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                  </div>
                </div>
              </div>
              
              <div class="content-section">
                <div class="content-title">Estimado(a) Estudiante,</div>
                
                <div class="content-text">
                  ${message.split('\n').map(line => `<p style="margin: 12px 0;">${line}</p>`).join('')}
                </div>
                
                <div class="details-grid">
                  <div class="detail-card">
                    <div class="detail-label">📅 Fecha</div>
                    <div class="detail-value">${eventDate ? new Date(eventDate).toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Por confirmar'}</div>
                  </div>
                  
                  <div class="detail-card">
                    <div class="detail-label">🕐 Horario</div>
                    <div class="detail-value">${eventTime || 'Por confirmar'}</div>
                  </div>
                  
                  <div class="detail-card">
                    <div class="detail-label">📍 Ubicación</div>
                    <div class="detail-value">${eventLocation || 'Instituto Vallegrande'}</div>
                  </div>
                  
                  ${eventShift ? `
                  <div class="detail-card">
                    <div class="detail-label">🌙 Turno</div>
                    <div class="detail-value">${eventShift}</div>
                  </div>
                  ` : ''}
                  
                  ${eventClassroom ? `
                  <div class="detail-card">
                    <div class="detail-label">🏫 Aula</div>
                    <div class="detail-value">${eventClassroom}</div>
                  </div>
                  ` : ''}
                </div>
                
                ${criteria ? `
                <div class="criteria-section">
                  <div class="criteria-title">⭐ Criterios de Evaluación</div>
                  ${criteria.split('\n').filter(line => line.trim()).map(line => `
                    <div class="criteria-item">✓ ${line}</div>
                  `).join('')}
                </div>
                ` : ''}
              </div>
              
              <div class="cta-section">
                <div style="font-size: 24px; font-weight: 700; color: #0a4275; margin-bottom: 15px;">
                  Registro de Asistencia
                </div>
                <div style="font-size: 14px; color: #666; margin-bottom: 25px;">
                  Haz clic en el botón para registrar tu asistencia al evento
                </div>
                <a href="http://localhost:5173/register" class="cta-button" style="display: inline-block; background: #FFC300; color: #0a4275; padding: 18px 60px; border-radius: 50px; text-decoration: none; font-weight: 700; font-size: 18px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 8px 25px rgba(255, 195, 0, 0.4);">
                  📝 REGISTRAR ASISTENCIA
                </a>
                <div style="font-size: 12px; color: #999; margin-top: 15px; font-style: italic;">
                  * Completa el formulario de registro para confirmar tu participación
                </div>
              </div>
            </div>
          </body>
        </html>
      `;

      const payload = {
        recipients: validRecipients,
        subject,
        message,
        html_content: htmlContent
      };

      // Agregar credenciales si se usa método directo
      if (useDirectCredentials) {
        payload.sender_email = senderEmail;
        payload.sender_password = senderPassword;
      }

      const response = await invitationApi.sendInvitation(payload);

      setResult(response);
      
      if (response.success) {
        // Mostrar toast de éxito
        showToast(`✓ Invitaciones enviadas exitosamente a ${response.sent} destinatario${response.sent !== 1 ? 's' : ''}`, 'success');
        
        // Limpiar formulario completo después de enviar
        setRecipients(['']);
        setSubject('');
        setMessage('');
        setEventDate('');
        setEventTime('');
        setEventLocation('');
        setEventShift('');
        setEventClassroom('');
        setChallengeName('');
        setCriteria('');
        setSelectedStudents([]);
      } else {
        showToast('✗ Error al enviar invitaciones', 'error');
      }
    } catch (error) {
      setResult({
        success: false,
        error: error.message
      });
      showToast(`✗ Error: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-8 font-['Livvic']">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Livvic:wght@300;400;500&display=swap');
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-10px) rotate(2deg);
          }
          50% {
            transform: translateY(-15px) rotate(0deg);
          }
          75% {
            transform: translateY(-10px) rotate(-2deg);
          }
        }
        
        @keyframes wave {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(10deg);
          }
          75% {
            transform: rotate(-10deg);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-wave {
          animation: wave 2s ease-in-out infinite;
          transform-origin: bottom center;
        }
      `}</style>
      
      {/* Header con fondo y manchas */}
      <div className="relative bg-[#859ECA] rounded-3xl px-10 py-6 overflow-visible shadow-lg">
        {/* Manchas decorativas */}
        <div className="absolute top-8 right-64 w-32 h-32 bg-[#9CB3DD] rounded-full opacity-40 blur-2xl"></div>
        <div className="absolute bottom-12 left-32 w-40 h-40 bg-[#9CB3DD] rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute top-20 left-1/3 w-24 h-24 bg-[#9CB3DD] rounded-full opacity-25 blur-2xl"></div>
        
        <div className="relative z-10">
          {/* Título */}
          <h1 className="text-white text-[26px] font-light mb-2 tracking-wide flex items-center gap-3">
            <Mail className="w-7 h-7" />
            ENVIAR INVITACIONES
          </h1>
          <p className="text-white/90 text-sm">
            Configura tu correo y envía invitaciones a tus estudiantes
          </p>
        </div>

        {/* Robot */}
        <div className="absolute right-6 -bottom-8 w-[160px] h-[160px] pointer-events-none z-30 animate-float">
          <img
            src="/src/assets/robots/mini-robot04.png"
            alt="Robot"
            className="w-full h-full object-contain drop-shadow-2xl hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>
      </div>

      {/* Autenticación */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">Autenticación</h2>
        </div>

        {/* Tabs para elegir método */}
        <div className="flex gap-2 mb-4 border-b">
          <button
            onClick={() => setUseDirectCredentials(false)}
            disabled={checkingAuth}
            className={`px-4 py-2 font-medium transition ${
              !useDirectCredentials
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            🔐 Google OAuth
          </button>
          <button
            onClick={() => setUseDirectCredentials(true)}
            className={`px-4 py-2 font-medium transition ${
              useDirectCredentials
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            ⚡ Credenciales Directas
          </button>
        </div>

        {/* Método 1: Google OAuth */}
        {!useDirectCredentials && (
          <>
            {checkingAuth ? (
              <div className="text-center py-4">
                <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Verificando autenticación...</p>
              </div>
            ) : isAuthenticated ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div className="flex-1">
                      <p className="font-medium text-green-800">✓ Autenticado con Google</p>
                      <p className="text-sm text-green-700">{userEmail}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition font-medium"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                  <p className="text-sm text-blue-800">
                    <strong>✓ Listo para enviar:</strong> Puedes enviar invitaciones sin ingresar contraseñas.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">🔐</div>
                    <div>
                      <p className="font-medium text-blue-800">Método más seguro y cómodo</p>
                      <p className="text-sm text-blue-700 mt-1">
                        Inicia sesión una vez con tu cuenta @vallegrande.edu.pe y envía invitaciones sin ingresar contraseñas cada vez.
                      </p>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleGoogleLogin}
                  className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition flex items-center justify-center gap-3 font-medium shadow-sm"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Iniciar sesión con Google
                </button>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                  <p className="text-xs text-yellow-800">
                    <strong>Nota:</strong> Si el botón no funciona, asegúrate de que el backend esté configurado con las credenciales de Google OAuth. Ver archivo CONFIGURACION_GOOGLE_OAUTH.md
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Método 2: Credenciales Directas */}
        {useDirectCredentials && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4">
              <p className="text-sm text-blue-800">
                <strong>Método rápido:</strong> Usa tu correo @vallegrande.edu.pe y una contraseña de aplicación de Gmail.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tu correo institucional
              </label>
              <input
                type="email"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                placeholder="docente@vallegrande.edu.pe"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña de aplicación
              </label>
              <input
                type="password"
                value={senderPassword}
                onChange={(e) => setSenderPassword(e.target.value)}
                placeholder="xxxx xxxx xxxx xxxx"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                <a 
                  href="https://myaccount.google.com/apppasswords" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Crear contraseña de aplicación →
                </a>
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mt-4">
              <p className="text-sm text-blue-800">
                <strong>Nota:</strong> Solo puedes enviar correos a direcciones @vallegrande.edu.pe
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Formulario de invitación */}
      <form onSubmit={handleSend} className="bg-white rounded-2xl shadow-sm p-6">
        {/* Destinatarios */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Destinatarios
            </label>
            <button
              type="button"
              onClick={() => setShowStudents(!showStudents)}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 transition"
            >
              <Users className="w-4 h-4" />
              Seleccionar estudiantes ({students.length})
            </button>
          </div>

          {/* Modal de selección de estudiantes */}
          {showStudents && (
            <div className="mb-4 p-4 border-2 border-blue-200 rounded-xl bg-blue-50/50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-800">Selecciona estudiantes</h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowStudents(false);
                    setSelectedClassroomFilter('');
                    setFilteredStudents(students);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Filtro por Classroom */}
              <div className="mb-3">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <School className="w-4 h-4" />
                  Filtrar por Aula/Sección
                </label>
                <select
                  value={selectedClassroomFilter}
                  onChange={(e) => handleClassroomFilterChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="">Todos los estudiantes ({students.length})</option>
                  {loadingClassrooms ? (
                    <option disabled>Cargando aulas...</option>
                  ) : (
                    classrooms.map((classroom) => (
                      <option key={`${classroom.code}-${classroom.section}`} value={`${classroom.code}-${classroom.section}`}>
                        {classroom.code}-{classroom.section}
                      </option>
                    ))
                  )}
                </select>
              </div>
              
              <div className="max-h-64 overflow-y-auto">
                {filteredStudents.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    {selectedClassroomFilter 
                      ? 'No hay estudiantes con correo en esta aula'
                      : 'No hay estudiantes registrados con correo electrónico'}
                  </p>
                ) : (
                  <>
                    <div className="space-y-2 mb-3">
                      {filteredStudents.map((student) => (
                        <label
                          key={student.id}
                          className="flex items-center gap-3 p-2.5 hover:bg-white rounded-lg cursor-pointer transition"
                        >
                          <input
                            type="checkbox"
                            checked={selectedStudents.some(s => s.id === student.id)}
                            onChange={() => toggleStudent(student)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">{student.name}</p>
                            <p className="text-xs text-gray-500">{student.email}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                    
                    <button
                      type="button"
                      onClick={addSelectedStudents}
                      disabled={selectedStudents.length === 0}
                      className="w-full bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium transition"
                    >
                      Agregar {selectedStudents.length} estudiante{selectedStudents.length !== 1 ? 's' : ''}
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {recipients.map((recipient, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="email"
                value={recipient}
                onChange={(e) => updateRecipient(index, e.target.value)}
                placeholder="correo@ejemplo.com"
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required={index === 0}
              />
              {recipients.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRecipient(index)}
                  className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addRecipient}
            className="mt-2 flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 transition"
          >
            <Plus className="w-4 h-4" />
            Agregar destinatario manualmente
          </button>
        </div>

        {/* Asunto */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Asunto / Título del Evento
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Ej: Hackathon 2025 - Innovación Tecnológica"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Detalles del Evento */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📅 Fecha
            </label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🕐 Hora
            </label>
            <input
              type="time"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📍 Lugar
            </label>
            <input
              type="text"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
              placeholder="Ej: Auditorio Principal"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🌙 Turno
            </label>
            <select
              value={eventShift}
              onChange={(e) => setEventShift(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Seleccionar turno</option>
              <option value="Mañana">Mañana</option>
              <option value="Tarde">Tarde</option>
              <option value="Noche">Noche</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🏫 Aula / Sección
          </label>
          <select
            value={eventClassroom}
            onChange={(e) => setEventClassroom(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Seleccionar aula (opcional)</option>
            {loadingClassrooms ? (
              <option disabled>Cargando aulas...</option>
            ) : (
              classrooms.map((classroom) => (
                <option key={`${classroom.code}-${classroom.section}`} value={`${classroom.code}-${classroom.section}`}>
                  {classroom.code}-{classroom.section}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🎯 Seleccionar Reto
          </label>
          <select
            value={selectedChallengeId}
            onChange={(e) => {
              setSelectedChallengeId(e.target.value);
              const challenge = challenges.find(c => c.id === parseInt(e.target.value));
              setChallengeName(challenge ? challenge.name : '');
            }}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Seleccionar reto (opcional)</option>
            {challenges.map((challenge) => (
              <option key={challenge.id} value={challenge.id}>
                {challenge.name}
              </option>
            ))}
          </select>
          {challengeName && (
            <p className="text-xs text-gray-500 mt-1">
              Reto seleccionado: {challengeName}
            </p>
          )}
        </div>

        {/* Mensaje */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📝 Mensaje / Descripción
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe el evento, objetivos, y cualquier información relevante..."
            rows="6"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            required
          />
        </div>

        {/* Criterios de Evaluación */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ⭐ Seleccionar Criterios de Evaluación (opcional)
          </label>
          <div className="border border-gray-300 rounded-xl p-4 max-h-48 overflow-y-auto">
            {criteriaList.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-2">No hay criterios disponibles</p>
            ) : (
              criteriaList.map((criterion) => (
                <label
                  key={criterion.id}
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedCriteriaIds.includes(criterion.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCriteriaIds([...selectedCriteriaIds, criterion.id]);
                      } else {
                        setSelectedCriteriaIds(selectedCriteriaIds.filter(id => id !== criterion.id));
                      }
                    }}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{criterion.name}</p>
                    {criterion.description && (
                      <p className="text-xs text-gray-500">{criterion.description}</p>
                    )}
                  </div>
                </label>
              ))
            )}
          </div>
          {selectedCriteriaIds.length > 0 && (
            <p className="text-xs text-gray-500 mt-2">
              {selectedCriteriaIds.length} criterio{selectedCriteriaIds.length !== 1 ? 's' : ''} seleccionado{selectedCriteriaIds.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Botón enviar */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#FFC300] text-white py-3.5 rounded-xl hover:bg-[#FFE347] disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-bold text-sm transition shadow-lg"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              ENVIAR INVITACIONES
            </>
          )}
        </button>
      </form>

      {/* Resultado */}
      {result && (
        <div className={`p-5 rounded-2xl shadow-sm ${result.success ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}`}>
          <div className="flex items-start gap-3">
            {result.success ? (
              <CheckCircle className="w-6 h-6 text-green-600 mt-0.5" />
            ) : (
              <AlertCircle className="w-6 h-6 text-red-600 mt-0.5" />
            )}
            <div className="flex-1">
              <p className={`font-bold text-lg ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                {result.success ? '✓ Invitaciones enviadas' : '✗ Error al enviar'}
              </p>
              {result.success && (
                <div className="mt-2 text-sm text-green-700">
                  <p>✓ Enviados exitosamente: {result.sent}</p>
                  {result.failed > 0 && (
                    <p className="text-red-700">✗ Fallidos: {result.failed}</p>
                  )}
                </div>
              )}
              {result.error && (
                <p className="mt-1 text-sm text-red-700">{result.error}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast de notificaciones */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
