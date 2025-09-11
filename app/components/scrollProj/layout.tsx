import styles from "./scrollScene.module.css";

export default function ScrollProjLayout({ children }: { children: React.ReactNode }) {
  return <div className={styles.root}>{children}</div>;
}