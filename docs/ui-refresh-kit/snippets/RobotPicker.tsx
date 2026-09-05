import { motion } from 'framer-motion';
import { robotCatalog } from './robotCatalog';

export function RobotPicker({ selectedId, onSelect }: { selectedId: string; onSelect: (id: string) => void }) {
  return (
    <div className="robot-grid">
      {robotCatalog.map((robot) => (
        <motion.button
          key={robot.id}
          whileTap={{ scale: 0.97 }}
          className={selectedId === robot.id ? 'robot-card robot-card--selected' : 'robot-card'}
          onClick={() => onSelect(robot.id)}
        >
          <img src={robot.portrait} alt={robot.name} />
          <span>{robot.name}</span>
        </motion.button>
      ))}
    </div>
  );
}
