import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';

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
});

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
  'Multimercados',
  'Multimercados;LS/Arb'
];

export default function FundoForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      relatorios: []
    }
  });

  const temFundomaster = watch('st_cnpj_fundomaster');

  const onSubmit = async (data: FormData) => {
    try {
      // Formata os CNPJs para o padrão do CSV (com pontuação)
      const formattedData = {
        ...data,
        st_cnpj_fundo: formatCNPJ(data.st_cnpj_fundo),
        st_cnpj_fundomaster: data.st_cnpj_fundomaster ? formatCNPJ(data.st_cnpj_fundomaster) : null
      };
      
      const response = await axios.post('http://localhost:8000/api/fundos/', formattedData);
      alert('Fundo cadastrado com sucesso!');
    } catch (error) {
      alert('Erro ao cadastrar fundo.');
    }
  };

  const formatCNPJ = (cnpj: string) => {
    if (!cnpj) return '';
    // Se já está formatado, retorna como está
    if (cnpj.includes('.')) return cnpj;
    return `${cnpj.substring(0, 2)}.${cnpj.substring(2, 5)}.${cnpj.substring(5, 8)}/${cnpj.substring(8, 12)}-${cnpj.substring(12)}`;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold">Informações Básicas do Fundo</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">CNPJ do Fundo*</label>
          <input
            {...register('st_cnpj_fundo')}
            placeholder="00.000.000/0000-00"
            className="w-full p-2 border rounded"
          />
          {errors.st_cnpj_fundo && (
            <p className="text-red-500 text-sm">{errors.st_cnpj_fundo.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1">Classe ANBIMA*</label>
          <select
            {...register('st_classe_fundo')}
            className="w-full p-2 border rounded"
          >
            <option value="">Selecione</option>
            {CLASSES_ANBIMA.map(classe => (
              <option key={classe} value={classe}>{classe}</option>
            ))}
          </select>
          {errors.st_classe_fundo && (
            <p className="text-red-500 text-sm">{errors.st_classe_fundo.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block mb-1">Estratégia de Investimento*</label>
        <select
          {...register('st_estrategia_fundo')}
          className="w-full p-2 border rounded"
        >
          <option value="">Selecione</option>
          {ESTRATEGIAS.map(estrategia => (
            <option key={estrategia} value={estrategia}>{estrategia}</option>
          ))}
        </select>
        {errors.st_estrategia_fundo && (
          <p className="text-red-500 text-sm">{errors.st_estrategia_fundo.message}</p>
        )}
      </div>

      <div>
        <label className="block mb-1">Observações</label>
        <textarea
          {...register('st_obs_fundo')}
          placeholder="Informações adicionais"
          className="w-full p-2 border rounded"
          rows={3}
        />
      </div>

      <h2 className="text-xl font-semibold mt-6">Fundomaster (Opcional)</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">Código Quantum</label>
          <input
            {...register('cod_quantum_fundomaster')}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1">CNPJ Fundomaster</label>
          <input
            {...register('st_cnpj_fundomaster')}
            placeholder="00.000.000/0000-00"
            className="w-full p-2 border rounded"
          />
          {errors.st_cnpj_fundomaster && (
            <p className="text-red-500 text-sm">{errors.st_cnpj_fundomaster.message}</p>
          )}
        </div>
      </div>

      <h2 className="text-xl font-semibold mt-6">Relatórios*</h2>
      <div className="space-y-2">
        {RELATORIOS_OPCOES.map(relatorio => (
          <div key={relatorio} className="flex items-center">
            <input
              type="checkbox"
              id={`relatorio-${relatorio}`}
              value={relatorio}
              {...register('relatorios')}
              className="mr-2"
            />
            <label htmlFor={`relatorio-${relatorio}`}>{relatorio}</label>
          </div>
        ))}
        {errors.relatorios && (
          <p className="text-red-500 text-sm">{errors.relatorios.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="mt-6 bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition"
      >
        Cadastrar Fundo
      </button>
    </form>
  );
}