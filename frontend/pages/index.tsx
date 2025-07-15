import FundoForm from '../components/FundoForm';
import styles from './FundoForm.module.css';

export default function Home() {
  return (
    <div className="container mx-auto p-4" style={{fontFamily: 'Arial, sans-serif'} }>
      <h1 className="text-2xl font-bold mb-4">Cadastro de Fundos</h1>
      <FundoForm />
    </div>
  );
}
