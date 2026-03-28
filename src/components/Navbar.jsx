import { Link } from 'react-router-dom'

const Navbar = () => (
  <nav style={{ padding: 12, background: '#1976d2' }}>
    {[
      ['/', 'Login'],
      ['/profile', 'Profile'],
      ['/colleges', 'Colleges'],
      ['/prediction', 'Prediction'],
      ['/tracker', 'Tracker'],
      ['/documents', 'Documents'],
      ['/chatbot', 'Chatbot']
    ].map(([path, label]) => (
      <Link key={path} to={path} style={{ color: '#fff', marginRight: 15 }}>
        {label}
      </Link>
    ))}
  </nav>
)

export default Navbar
