import './Divider.css';

interface DividerProps {
  className?: string;
}

export default function Divider({ className = '' }: DividerProps) {
  return <div className={`divider ${className}`} />;
}
