import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button"



export default function Team () {

    return (
        <div className="w-full bg-white">
        <div className="w-full px-4 py-8 md:py-20 max-w-8xl mx-auto flex flex-col gap-12 items-center">
            <div className='flex flex-col items-center gap-3 max-w-md '>
                <h4 className="text-primary uppercase text-xs font-medium">property partners</h4>
                <h1 className="text-2xl md:text-4xl capitalize font-semibold text-start">meet our expert agents</h1>
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-5 sm:grid-cols-2 gap-6">
                {
                    _teams.map((team, index) => (
                        <TeamCard 
                            key={index}
                            image={team.image}
                            role={team.role}
                            name={team.name}
                        />
                    ))
                }
            </div>
        </div>
        </div>
    )
}

const TeamCard = ({ image, role, name }: {image: string, name: string, role: string}) => {
    return (
       <div className="w-full max-w-sm p-1 flex flex-col border border-primary/50 gap-3 hover:scale-105 rounded-2xl pb-6 duration-300">
           <img src={image} alt={name} className="rounded-2xl aspect-square object-cover flex  " />
           <div className="w-full flex items-center flex-col gap-1">
                <p className="capitalize font-medium text-xs">{name}</p>
                <p className="capitalize text-[10px] text-muted-foreground">{role}</p>
           </div>

           <div className="flex items-center gap-2 w-full justify-center">
            <Facebook className="text-primary   rounded-lg p-1  w-8 border"  />
            <Twitter className="text-primary   rounded-lg p-1  w-8 border"  />
            <Instagram className="text-primary   rounded-lg p-1  w-8 border"  />
            <Linkedin className="text-primary   rounded-lg p-1  w-8 border"  />
        </div>
       </div>
    );
  };


  const _teams = [
    {
      id: 1,
      name: "Emma Johnson",
      role: "Chief Executive Officer",
      image: "https://randomuser.me/api/portraits/women/45.jpg",
    },
    {
      id: 2,
      name: "Liam Smith",
      role: "Head of Operations",
      image: "https://randomuser.me/api/portraits/men/35.jpg",
    },
    {
      id: 3,
      name: "Olivia Brown",
      role: "Marketing Director",
      image: "https://randomuser.me/api/portraits/women/50.jpg",
    },
    {
      id: 4,
      name: "Noah Williams",
      role: "Lead Developer",
      image: "https://randomuser.me/api/portraits/men/40.jpg",
    },
    {
      id: 5,
      name: "Sophia Davis",
      role: "Human Resources Manager",
      image: "https://randomuser.me/api/portraits/women/33.jpg",
    },
  ];
  