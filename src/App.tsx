import { useState } from 'react';
import Form from './components/Form/Form';
import TItem from './models/item';
import Stats from './components/Stats/Stats';
import sortDates from './utils/sortDates';

const App = () => {
  const [form, setForm] = useState<TItem>({ date: '', km: '' });
  const [list, setList] = useState<TItem[]>([]);

  // Обработчик cобытия 'change' на инпутах:
  const handleInputChange = (currentForm: TItem) => {
    setForm(currentForm); // Ререндер (состояние form) -> Обновление полей формы
  };

  // Обработчик cобытия 'submit' на форме:
  const handleSubmit = (newForm: TItem) => {
    if (newForm.date === '' || newForm.km === '') {
      setForm(newForm); // Ререндер (состояние form) -> Сброс невалидного инпута
      return;
    }
    // Если данные полей ввода валидны и полные:
    const newList = createNewList(newForm); // Свежий массив с актуальными данными
    setList(newList); // Ререндер (состояние list) -> Актуализация массива с данными
    setForm({ date: '', km: '' }); // Ререндер (состояние form) -> Очистка полей формы
  };

  // Создание нового массива с актуализированными данными:
  const createNewList = (newForm: TItem) => {
    let newList: TItem[] = [];
    const km = (+newForm.km).toFixed(1); // Округление km до десятых долей

    if (list.length) {
      const idx = list.findIndex((el) => el.date === newForm.date);
      if (idx === -1) {
        newList = [...list, { ...newForm, km }];
        sortDates(newList); // Сортируем массив по датам
      } else {
        newList = list.map((item, index) => {
          if (index === idx) {
            item.km = (Number(item.km) + Number(km)).toFixed(1); // Округление km при сложении
          }
          return item;
        });
      }
    } else {
      newList = [{ ...newForm, km }];
    }

    return newList;
  };

  const handleUpdateItem = (item: TItem) => {
    setList(list.filter((el) => el.date !== item.date)); // Ререндер (состояние list) -> Фильтруем
    setForm(item); // Ререндер (состояние form) -> Перекидываем данные элемента в форму
  };

  const handleRemoveItem = (date: string) => {
    setList(list.filter((el) => el.date !== date)); // Ререндер (состояние list) -> Фильтруем массив
  };

  return (
    <>
      <Form form={form} onInputChange={handleInputChange} onSubmit={handleSubmit} />
      <Stats list={list} onUpdate={handleUpdateItem} onRemove={handleRemoveItem} />
    </>
  );
};

export default App;
