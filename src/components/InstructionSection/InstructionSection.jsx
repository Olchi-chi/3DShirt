import './InstructionSection.css';
import image1 from '../../assets/Shag_1.png';
import image2 from '../../assets/Shag_2.png';
import image3 from '../../assets/Shag_3.png';

const blockInfo = [
  { id:1, shagname:'Шаг 1. Выберите цвет футболки', description: 'Сначала выберите желаемый цвет изделия — в разделе будут доступны все варианты, на которых можно разместить свой дизайн.', imageurl: image1},
  { id:2, shagname:'Шаг 2. Добавьте изображение', description: 'Загрузите своё изображение. С помощью простых инструментов вы можете менять размер, поворачивать, перемещать и cтилизовать элементы под свои идеи.', imageurl: image2},
  { id:3, shagname:'Шаг 3. Посмотрите, как это будет выглядеть', description: 'Проверьте как ваш принт будет смотреться на реальной футболке выбранного цвета. Если вариант понравился, то сможете сохранить в виде png изображения.', imageurl: image3},
];
export default function InstructionSection() {
    const firstItem = blockInfo[0];
    const secondItem = blockInfo[1];
    const thirdItem = blockInfo[2];

    return(
        <section className="instruction-section" id="instruction">
            <h2>Описание шагов создания изделия</h2>
            <div className="instruction-section__info">
                {firstItem && (
                    <div className="instruction-section__block">
                        <img src={firstItem.imageurl} alt={firstItem.shagname} className="instruction-section__image"/>
                        <div className="instruction-section__text-block">
                            <h3>{firstItem.shagname}</h3>
                            <p>{firstItem.description}</p>
                        </div>
                    </div>
                )}
                {secondItem && (
                    <div className="instruction-section__block">
                        <div className="instruction-section__text-block right">
                            <h3>{secondItem.shagname}</h3>
                            <p>{secondItem.description}</p>
                        </div>
                        <img src={secondItem.imageurl} alt={secondItem.shagname} className="instruction-section__image"/>
                    </div>
                )}
                {thirdItem && (
                    <div className="instruction-section__block">
                        <img src={thirdItem.imageurl} alt={thirdItem.shagname} className="instruction-section__image"/>
                        <div className="instruction-section__text-block third">
                            <h3>{thirdItem.shagname}</h3>
                            <p>{thirdItem.description}</p>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}