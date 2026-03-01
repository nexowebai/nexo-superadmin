import { Check, Clock, Flag, Target, Users, FileText, AlertCircle } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';
import { cn } from '@lib/cn';
import './Timeline.css';

const TIMELINE_ICONS = {
    milestone: Flag,
    task: Target,
    team: Users,
    form: FileText,
};

function Timeline({ items = [] }) {
    if (!items.length) return null;

    return (
        <div className="project-timeline-container">
            <div className="project-timeline-track">
                {items.map((item, index) => {
                    const Icon = TIMELINE_ICONS[item.type] || Flag;
                    const isCompleted = item.status === 'completed';
                    const isPending = item.status === 'pending';
                    const itemDate = new Date(item.date);
                    const isOverdue = isPending && isPast(itemDate) && !isToday(itemDate);

                    return (
                        <div
                            key={item.id || index}
                            className={cn(
                                'timeline-item',
                                isCompleted && 'timeline-item--completed',
                                isPending && 'timeline-item--pending',
                                isOverdue && 'timeline-item--overdue'
                            )}
                        >
                            <div className="timeline-item__connector">
                                <div className="timeline-item__line timeline-item__line--top" />
                                <div className="timeline-item__dot">
                                    {isCompleted ? (
                                        <Check size={12} />
                                    ) : isOverdue ? (
                                        <AlertCircle size={12} />
                                    ) : (
                                        <Clock size={12} />
                                    )}
                                </div>
                                <div className="timeline-item__line timeline-item__line--bottom" />
                            </div>
                            <div className="timeline-item__content">
                                <div className="timeline-item__header">
                                    <div className="timeline-item__icon-wrapper">
                                        <Icon size={14} />
                                    </div>
                                    <span className="timeline-item__type">{item.type}</span>
                                    <span className="timeline-item__date">
                                        {format(itemDate, 'MMM d, yyyy')}
                                    </span>
                                </div>
                                <h4 className="timeline-item__title">{item.title}</h4>
                                {item.description && (
                                    <p className="timeline-item__description">{item.description}</p>
                                )}
                                <div className="timeline-item__status">
                                    <span className={cn(
                                        'timeline-status-badge',
                                        `timeline-status-badge--${isOverdue ? 'overdue' : item.status}`
                                    )}>
                                        {isOverdue ? 'Overdue' : isCompleted ? 'Completed' : 'Pending'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Timeline;
