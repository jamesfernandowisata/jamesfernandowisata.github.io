import Image from "next/image";
import NavBar from "@/components/navbar";
import { Libre_Bodoni } from "next/font/google";

const Bodoni = Libre_Bodoni({
  weight: '400',
  subsets: ['latin'],
})

export default function Home() {
  <style>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Libre+Bodoni:ital,wght@0,400..700;1,400..700&family=Playfair+Display+SC:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
</style>
  return (
    <>
    <body suppressHydrationWarning>
    <NavBar/>
    <div className="fixed z-1 pl-24 text-white text-6xl Bodoni w-full">
    <span className={Bodoni.className}> <p className="stretch pl-48 pt-10">JAMES FERNANDO</p></span>
  
      </div>
    <div className="pl-96" >

      <div className="bg-red-600 h-screen w-[80%] z-10">
   
      </div>
     

     
    
    </div>
    </body>
    </>
  );
}
