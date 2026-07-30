import { FaGraduationCap } from 'react-icons/fa'
export default function Brand({ compact = false }) { return <div className="brand"><span className="brand-mark"><FaGraduationCap /></span>{!compact && <span><strong>SRMS</strong><small>Student Records</small></span>}</div> }
