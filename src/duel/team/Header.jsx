export default function Header({ name, links, favoriteCount = 0 }) {
  return (
    <header>
      <h1>{name}</h1>
      <p className="header-favorites" aria-live="polite">♡ {favoriteCount} favoritas</p>
      <nav aria-label="Principal">
        <ul>
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
