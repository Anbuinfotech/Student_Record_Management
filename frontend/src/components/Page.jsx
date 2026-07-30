import { motion } from 'framer-motion'
export default function Page({ title, subtitle, actions, children }) { return <motion.div className="page" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .28 }}><header className="page-heading"><div><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>{actions}</header>{children}</motion.div> }
