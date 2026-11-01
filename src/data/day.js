// Sample day shown in the Super App scene. Names and times are illustrative.
export const DAY_START = 7 * 60;  // 07:00
export const DAY_END = 23 * 60;   // 23:00

export const events = [
  { time: '07:30', tag: 'SmartDose', text: 'Carteira da manhã pronta, 3 comprimidos', now: 'A carteira da manhã está pronta' },
  { time: '08:15', tag: 'Toma', text: 'Confirmada pela cuidadora Ana Lopes', now: 'Toma da manhã confirmada' },
  { time: '10:00', tag: 'Cuidados', text: 'Ana chegou. Higiene e pequeno-almoço', now: 'A cuidadora está em casa' },
  { time: '11:45', tag: 'SafeMove', alert: true, text: 'Desequilíbrio ao levantar. Alerta enviado à Medcei', now: 'O SafeMove avisou a Medcei' },
  { time: '11:51', tag: 'Equipa Medcei', text: 'Ligou à D. Amélia. Está bem, sem queda', now: 'A equipa ligou: está tudo bem' },
  { time: '14:30', tag: 'WoundCare', text: 'Ferida medida: 4,1 cm², a melhorar', now: 'A ferida está a melhorar' },
  { time: '16:30', tag: 'SafeMove', text: 'Saída da zona segura: passeio no jardim', now: 'Passeio no jardim' },
  { time: '18:00', tag: 'Vídeo-chamada', text: 'Rita falou 12 minutos com a mãe', now: 'Vídeo-chamada com a filha' },
  { time: '20:00', tag: 'SmartDose', text: 'Carteira da noite pronta, 2 comprimidos', now: 'A carteira da noite está pronta' },
  { time: '22:30', tag: 'SafeMove', text: 'Monitorização noturna ativa', now: 'Noite vigiada pelo SafeMove' },
];

export const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

export const toClock = (minutes) => {
  const h = Math.floor(minutes / 60);
  const m = Math.floor(minutes % 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};
