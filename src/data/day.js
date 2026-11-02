// Sample day shown in the family app scene: what the app tells a family member.
// Names and times are illustrative.
export const DAY_START = 7 * 60;  // 07:00
export const DAY_END = 23 * 60;   // 23:00

export const events = [
  { time: '08:00', tag: 'Horário', text: 'Hoje: visita das 9:00 às 11:00, com a Ana Lopes', now: 'O horário de hoje está na app' },
  { time: '09:40', tag: 'Mensagem', text: 'Joana: a consulta de quinta é às 15h. A visita pode ser mais cedo?', now: 'A família escreveu à equipa' },
  { time: '10:05', tag: 'Equipa', text: 'Resposta: a visita de quinta passa para as 13h, com a Sara', now: 'A equipa respondeu' },
  { time: '12:30', tag: 'Cuidados', text: 'Plano de cuidados atualizado pela enfermeira', now: 'Plano de cuidados atualizado' },
  { time: '15:20', tag: 'Documentos', text: 'Joana enviou a receita de novembro', now: 'Receita entregue sem sair de casa' },
  { time: '17:45', tag: 'Evolução', text: 'Novo relatório de evolução: 74 em 100', now: 'Novo relatório de evolução' },
  { time: '19:10', tag: 'Pagamentos', alert: true, text: 'Nova mensalidade disponível: 1 480 €', now: 'Nova mensalidade disponível' },
  { time: '21:30', tag: 'Pagamentos', text: 'Pagamento recebido. Obrigado!', now: 'Mensalidade paga' },
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
