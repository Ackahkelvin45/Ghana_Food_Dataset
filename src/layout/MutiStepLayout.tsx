'use client'
import { useEffect, useState } from "react"
import Tab from "../components/Tab"
import Form1 from "../components/forms/Form1"
import Form2 from "../components/forms/Form2"
import Form3 from "../components/forms/Form3"
import Form4 from "../components/forms/Form4"
import Form5 from "../components/forms/Form5"
import Form6 from "../components/forms/Form6"

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
        setActive(parseInt(storedPage));
      }
    })
  return (
    <div className="flex w-full py-5 items-center gap-2   flex-col ">

      <Tab active={active} onTabClick={handleTabClick} />
      {
        active === 1 ? <Form1  handleNavigation={handleNavigation}/>:
        active === 2 ? <Form2  handleNavigation={handleNavigation} /> :
        active === 3 ? <Form3 handleNavigation={handleNavigation} /> :
        active === 4 ? <Form4 handleNavigation={handleNavigation} /> :
        active === 5 ? <Form5 handleNavigation={handleNavigation} /> :
        active === 6 ? <Form6 handleNavigation={handleNavigation} /> :
        <Form3 handleNavigation={handleNavigation}   />
      }

      

     


  
    </div>
  )
}

export default MutiStepLayout