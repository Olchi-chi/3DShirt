import { useState } from 'react'
import './App.css'
import Container from './components/Container/Container.jsx'
import Header from './components/Header/Header.jsx'
import ConstructorSection from './components/ConstructorSection/ConstructorSection.jsx'
import SizeSection from './components/SizeSection/SizeSection.jsx'
import InstructionSection from './components/InstructionSection/InstructionSection.jsx'
import Footer from './components/Footer/Footer.jsx'


function App() {
  return (
    <Container>
      <Header/>
      <main>
        <ConstructorSection/>
        <SizeSection/>
        <InstructionSection/>
        <section className="motivation">
          <p>Позвольте себе мечтать больше и создавать то, что раньше казалось невозможным. С нашим сайтом вы получаете шанс превратить даже самые неожиданные идеи в настоящие предметы. Это возможность смотреть на <strong>мир</strong> под <strong>новым углом</strong>, находить необычные решения и пробовать то, к чему давно тянули руки. Пусть каждый проект станет шагом вперёд — туда, где вас ждут новые открытия и яркие вдохновения!</p>
        </section>
      </main>
      <Footer/>
    </Container>
  )
}

export default App
