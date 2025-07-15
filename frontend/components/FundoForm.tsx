import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import styles from '../styles/FundoForm.module.css';

// Schema de validação atualizado com base no CSV
const schema = yup.object().shape({
  st_cnpj_fundo: yup
    .string()
    .required('CNPJ é obrigatório')
    .matches(/^(\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}|\d{14})$/, 'Formato inválido (00.000.000/0000-00 ou 14 dígitos)'),
  st_classe_fundo: yup.string().required('Classe ANBIMA é obrigatória'),
  st_estrategia_fundo: yup.string().required('Estratégia é obrigatória'),
  st_obs_fundo: yup.string(),
  cod_quantum_fundomaster: yup.string(),
  st_cnpj_fundomaster: yup
    .string()
    .matches(/^(\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}|\d{14}|)$/, 'Formato inválido'),
  relatorios: yup.array().of(yup.string()).min(1, 'Selecione pelo menos um relatório')
}).required();

type FormData = yup.InferType<typeof schema>;

// Opções baseadas nos dados do CSV
const CLASSES_ANBIMA = [
  'RV Int\'l USD',
  'MM Int\'l',
  'Multimercados'
];

const ESTRATEGIAS = [
  'RV Asia USD',
  'Asset Allocation - Int\'l',
  'Quant/Sist',
  'LS/Arb'
];

const RELATORIOS_OPCOES = [
  'RV Int\'l USD',
  'MM Int',
  'Multimercados'
];

export default function FundoForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<FormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      relatorios: []
    }
  });

  const temFundomaster = watch('st_cnpj_fundomaster');

  const onSubmit = async (data: FormData) => {
  try {
    // Mostra os dados antes do envio
    console.log("Dados do formulário:", JSON.stringify(data, null, 2));
    
    const formattedData = {
      ...data,
      st_cnpj_fundo: formatCNPJ(data.st_cnpj_fundo),
      st_cnpj_fundomaster: data.st_cnpj_fundomaster ? formatCNPJ(data.st_cnpj_fundomaster) : null,
      // Garante que relatorios seja array
      relatorios: Array.isArray(data.relatorios) ? data.relatorios : []
    };

    console.log("Dados formatados:", JSON.stringify(formattedData, null, 2));

    const response = await axios.post('http://localhost:8000/api/fundos/', formattedData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 5000
    });
    
    alert('Fundo cadastrado com sucesso!');
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      alert('O servidor demorou muito para responder. Tente novamente.');
    } else if (error.response) {
      // Erro 4xx/5xx do servidor
      alert(`Erro ${error.response.status}: ${error.response.data?.message || 'Dados inválidos'}`);
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      console.error("Erro de conexão:", error.request);
      alert('Servidor offline ou URL incorreta. Verifique se o backend está rodando.');
    } else {
      // Erro na configuração da requisição
      console.error("Erro:", error.message);
      alert('Erro ao enviar dados. Verifique o console.');
    }
  }
};

  const formatCNPJ = (cnpj: string) => {
    if (!cnpj) return '';
    if (cnpj.includes('.')) return cnpj;
    return `${cnpj.substring(0, 2)}.${cnpj.substring(2, 5)}.${cnpj.substring(5, 8)}/${cnpj.substring(8, 12)}-${cnpj.substring(12)}`;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
      <h2 className={styles.formTitle}>Informações Básicas do Fundo</h2>
      
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>CNPJ do Fundo*</label>
          <input
            {...register('st_cnpj_fundo')}
            placeholder="00.000.000/0000-00"
            className={styles.formInput}
          />
          {errors.st_cnpj_fundo && (
            <p className={styles.errorMessage}>{errors.st_cnpj_fundo.message}</p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Classe ANBIMA*</label>
          <select
            {...register('st_classe_fundo')}
            className={styles.formInput}
          >
            <option value="">Selecione</option>
            {CLASSES_ANBIMA.map(classe => (
              <option key={classe} value={classe}>{classe}</option>
            ))}
          </select>
          {errors.st_classe_fundo && (
            <p className={styles.errorMessage}>{errors.st_classe_fundo.message}</p>
          )}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Estratégia de Investimento*</label>
        <select
          {...register('st_estrategia_fundo')}
          className={styles.formInput}
        >
          <option value="">Selecione</option>
          {ESTRATEGIAS.map(estrategia => (
            <option key={estrategia} value={estrategia}>{estrategia}</option>
          ))}
        </select>
        {errors.st_estrategia_fundo && (
          <p className={styles.errorMessage}>{errors.st_estrategia_fundo.message}</p>
        )}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Observações</label>
        <textarea
          {...register('st_obs_fundo')}
          placeholder="Informações adicionais"
          className={styles.formInput}
          rows={3}
        />
      </div>

      <h2 className={styles.formTitle}>Fundomaster (Opcional)</h2>
      
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Código Quantum</label>
          <input
            {...register('cod_quantum_fundomaster')}
            className={styles.formInput}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>CNPJ Fundomaster</label>
          <input
            {...register('st_cnpj_fundomaster')}
            placeholder="00.000.000/0000-00"
            className={styles.formInput}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length === 14 && !value.includes('.')) {
                e.target.value = formatCNPJ(value);
              }
            }}
          />
          {errors.st_cnpj_fundomaster && (
            <p className={styles.errorMessage}>{errors.st_cnpj_fundomaster.message}</p>
          )}
        </div>
      </div>

      <h2 className={styles.formTitle}>Relatórios*</h2>
      <div className={styles.checkboxGroup}>
        {RELATORIOS_OPCOES.map(relatorio => (
          <div key={relatorio} className={styles.checkboxItem}>
            <input
              type="checkbox"
              id={`relatorio-${relatorio}`}
              value={relatorio}
              {...register('relatorios')}
              className={styles.checkboxInput}
            />
            <label htmlFor={`relatorio-${relatorio}`} className={styles.checkboxLabel}>
              {relatorio}
            </label>
          </div>
        ))}
        {errors.relatorios && (
          <p className={styles.errorMessage}>{errors.relatorios.message}</p>
        )}
      </div>

      <button
        type="submit"
        className={styles.submitButton}
      >
        Cadastrar Fundo
      </button>
    </form>
  );
}
