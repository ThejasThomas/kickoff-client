import { Calendar, ClipboardList, DollarSign, PlusCircle } from "lucide-react";
import path from "path";

export const sidebarItems = [
    {icon:DollarSign,label:'Earnings',path:'/turfOwner/earnings'},
    {icon:PlusCircle,label:'Add Turf',path:'/turfOwner/add-turf'},
    {icon:Calendar,label:'Add Slots',path:'/turfOwner/add-slots'},
    {icon:ClipboardList,label:'Bookings',path:'/turfOwner/bookings'}

]