const variants = {
  primary: "button button-primary",
  secondary: "button button-secondary",
  quiet: "button button-quiet",
  favorite: "button button-favorite",
  "favorite-active": "button button-favorite button-favorite-active",
};

export default function Button({ children, variant = "primary", type = "button", ...props }) {
  return (
    <button className={variants[variant] ?? variants.primary} type={type} {...props}>
      {children}
    </button>
  );
}
