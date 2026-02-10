'use client'
import { useEffect, useState } from "react"
import Tab from "../components/Tab"
import Form1 from "../components/forms/Form1"
import Form2 from "../components/forms/Form2"
import Form3 from "../components/forms/Form3"
import Form4 from "../components/forms/Form4"
import Form5 from "../components/forms/Form5"
import Form6 from "../components/forms/Form6"
import Completed from "../components/forms/completed"

function MutiStepLayout() {
    const [active, setActive]= useState<number>(1)
    const handleNavigation = (page:number, direction?:number, disableAnimation?:boolean) => {
        setActive(page)
              sessionStorage.setItem("page",page.toString());


    }

    const handleTabClick = (page: number) => {
        handleNavigation(page, page > active ? 1 : -1)
    }


    useEffect(() => {
      const storedPage = sessionStorage.getItem("page");
      if (storedPage) {
        const pageNum = parseInt(storedPage);
        setActive(pageNum <= 7 ? pageNum : 1);
      }
    })
  return (
    <div className="flex w-full py-4 sm:py-5 lg:py-6 items-center gap-3 sm:gap-4 flex-col">

      {active !== 7 && <Tab active={active} onTabClick={handleTabClick} />}
      {
        active === 1 ? <Form1  handleNavigation={handleNavigation}/>:
        active === 2 ? <Form2  handleNavigation={handleNavigation} /> :
        active === 3 ? <Form3 handleNavigation={handleNavigation} /> :
        active === 4 ? <Form4 handleNavigation={handleNavigation} /> :
        active === 5 ? <Form5 handleNavigation={handleNavigation} /> :
        active === 6 ? <Form6 handleNavigation={handleNavigation} /> :
        active === 7 ? <Completed handleNavigation={handleNavigation} /> :
        <Form3 handleNavigation={handleNavigation}   />
      }

    </div>
  )
}

export default MutiStepLayout