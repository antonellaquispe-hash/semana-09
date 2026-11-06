export default function Showtimes({ times, inline = false }) {
  if (times.length === 0) return <p>Sin funciones hoy</p>;
  if (inline) {
    return <div className="showtimes">{times.map((time) => <span key={time}>{time}</span>)}</div>;
  }
  return <ul className="showtimes">{times.map((time) => <li key={time}>{time}</li>)}</ul>;
}
