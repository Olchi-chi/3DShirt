import './SizeSection.css';
export default function SizeSection() {
    return(
        <section className="size-section" id="sizes">
            <h2>Размерная сетка изделия</h2>
            <div className="size-section__info">
                <div>
                    <div className="size-section__table"></div>
                    <div className="size-section__text-table">
                        <p>При разработке дизайна для футболки важно учитывать <strong>размерную сетку</strong> — это гарантия того, что ваш принт будет выглядеть правильно на всех размерах одежды. Наш инструмент позволяет загружать макеты с учётом реальных пропорций, чтобы изображение равномерно помещалось на футболках от XS до 4XL.</p>
                    </div>
                </div>
                <div className="size-section__person-photo"></div>
            </div>
        </section>
    );
}