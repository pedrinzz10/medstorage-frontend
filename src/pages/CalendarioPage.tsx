import { useCallback, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { DateClickArg } from '@fullcalendar/interaction';
import type { EventClickArg, EventContentArg, DatesSetArg } from '@fullcalendar/core';
import { AppLayout } from '../components/layout/AppLayout';
import { ScheduleVisitModal } from '../components/consignment/ScheduleVisitModal';
import { VisitDetailModal } from '../components/consignment/VisitDetailModal';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';
import type { ConsignmentVisit } from '../types';

const statusColor: Record<string, string> = {
  AGENDADA: 'var(--accent)',
  REALIZADA: 'var(--ok)',
  CANCELADA: 'var(--crit)',
};

export function CalendarioPage() {
  const { user } = useAuth();
  const canSchedule = user?.role === 'admin' || user?.role === 'gerente_estoque';

  const [visits, setVisits] = useState<ConsignmentVisit[]>([]);
  const [range, setRange] = useState<{ from: string; to: string } | null>(null);
  const [scheduleDate, setScheduleDate] = useState<string | null>(null);
  const [selectedVisit, setSelectedVisit] = useState<ConsignmentVisit | null>(null);
  const [loading, setLoading] = useState(false);

  const loadVisits = useCallback(async (from: string, to: string) => {
    setLoading(true);
    try {
      const data = await api.get<ConsignmentVisit[]>(`/api/consignment-visits?from=${from}&to=${to}`);
      setVisits(data);
    } catch {
      setVisits([]);
    } finally {
      setLoading(false);
    }
  }, []);

  function handleDatesSet(arg: DatesSetArg) {
    const from = arg.start.toISOString().slice(0, 10);
    const to = arg.end.toISOString().slice(0, 10);
    setRange({ from, to });
    void loadVisits(from, to);
  }

  function handleDateClick(arg: DateClickArg) {
    if (!canSchedule) return;
    setScheduleDate(arg.dateStr);
  }

  function handleEventClick(arg: EventClickArg) {
    const visit = visits.find(v => v.id === arg.event.id);
    if (visit) setSelectedVisit(visit);
  }

  function reload() {
    if (range) void loadVisits(range.from, range.to);
  }

  const events = visits.map(v => ({
    id: v.id,
    title: v.customerNome,
    date: v.dataAgendada,
    color: statusColor[v.status] ?? 'var(--accent)',
  }));

  return (
    <AppLayout>
      {scheduleDate && (
        <ScheduleVisitModal initialDate={scheduleDate} onClose={() => setScheduleDate(null)} onSaved={reload} />
      )}
      {selectedVisit && (
        <VisitDetailModal visit={selectedVisit} onClose={() => setSelectedVisit(null)} onChanged={reload} />
      )}

      <div className="flex items-center justify-between mb-7 flex-wrap gap-3">
        <h1 className="text-[26px] font-extrabold tracking-[-0.6px]">
          Calendário de <em className="not-italic" style={{ color: 'var(--accent)' }}>Visitas</em>
        </h1>
        {canSchedule && (
          <p className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
            Clique em uma data vazia para agendar uma visita
          </p>
        )}
      </div>

      <div className="neu-card rounded-[20px] p-5 medstorage-calendar" style={{ opacity: loading ? 0.6 : 1 }}>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height="auto"
          locale="pt-br"
          headerToolbar={{ left: 'prev,next today', center: 'title', right: '' }}
          buttonText={{ today: 'Hoje' }}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          datesSet={handleDatesSet}
          events={events}
          eventContent={(arg: EventContentArg) => (
            <div style={{
              background: arg.event.backgroundColor,
              color: 'var(--text-on-accent)',
              borderRadius: '6px',
              padding: '2px 6px',
              fontSize: '11px',
              fontWeight: 700,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {arg.event.title}
            </div>
          )}
        />
      </div>
    </AppLayout>
  );
}
