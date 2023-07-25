export default function Sidebar({
  header,
  children,
  footer
}: {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return <div className="app-sidebar">
    {header && <div className="p-1 sticky-top" style={{backgroundColor: "inherit"}}>{header}</div>}
    {children}
    {footer && <div className="p-1 sticky-bottom" style={{backgroundColor: "inherit"}}>{footer}</div>}
  </div>;
}