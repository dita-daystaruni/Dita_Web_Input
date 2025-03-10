import Headers from "../headers/headers";


export default function layout({ children }) {
  return (
    <div>
      <Headers />
      {children}
    </div>
  );
}