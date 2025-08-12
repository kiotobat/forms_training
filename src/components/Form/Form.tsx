import TItem from '../../models/item';
import './form.css';

interface IFormProps {
  form: TItem;
  onInputChange: (currentForm: TItem) => void;
  onSubmit: (newForm: TItem) => void;
}

const Form = ({ form, onInputChange, onSubmit }: IFormProps) => {

  const changeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const currentForm = { ...form, [name]: value.trim().replace(',', '.') };
    onInputChange(currentForm);
  };

  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    validateForm();
  };

  // Валидация формы и отправка данных наверх в App:
  const validateForm = () => {
    // Проверка даты:
    if (!form.date.match(/\d{2}\.\d{2}\.\d{2}/)) {
      onSubmit({ ...form, date: '' }); // Ререндер (состояние form) -> Сброс инпута с датой
      return;
    } 
    const inputDate = 20 + form.date.split('.').reverse().join('-'); // '2024-10-17'
    // Текущая дата с учетом часовых поясов ('2024-10-17'):
    const localDate = new Date(
      new Date().getTime() - new Date().getTimezoneOffset() * 1000 * 60
    )
      .toISOString()
      .slice(0, 10);
    // Если дату нельзя распарсить или она ещё не наступила:
    if (
      isNaN(Date.parse(inputDate)) ||
      Date.parse(inputDate) > Date.parse(localDate)
    ) {
      onSubmit({ ...form, date: '' });
      return;
    }

    // Проверка километража:
    if (!Number(form.km)) {
      onSubmit({ ...form, km: '' }); // Ререндер (состояние form) -> Сброс инпута с километражем
      return;
    }

    onSubmit({ ...form }); // Ререндер (состояние form) -> Отправка данных формы наверх в App
  };

  return (
    <form className="form" onSubmit={submitForm}>
      <div className="form__date">
        <label htmlFor="date" className="form__date-label">
          Дата (ДД.ММ.ГГ):
        </label>
        <input
          id="date"
          className="form__date-input"
          type="text"
          minLength={8}
          maxLength={8}
          placeholder="Введите верно дату ..."
          required
          name="date"
          onChange={changeInput}
          value={form.date}
        />
      </div>
      <div className="form__km">
        <label htmlFor="km" className="form__km-label">
          Пройдено (км):
        </label>
        <input
          id="km"
          className="form__km-input"
          type="text"
          maxLength={6}
          placeholder="Пройденное расстояние в км ..."
          required
          name="km"
          onChange={changeInput}
          value={form.km}
        />
      </div>
      <button className="form__button" type="submit">
        Добавить
      </button>
    </form>
  );
};

export default Form;
