import Furniture from "@mui/icons-material/Chair";
import Appliances from "@mui/icons-material/Kitchen";
import Clothes from "@mui/icons-material/Checkroom";
import Cars from "@mui/icons-material/AirportShuttle";
import Mobiles from "@mui/icons-material/PhoneAndroid";
import Books from "@mui/icons-material/Book"; 
import Toys from "@mui/icons-material/ChildCare";
import Pets from "@mui/icons-material/Pets";
import Bikes from "@mui/icons-material/TwoWheeler";

// all icon are import here title given exported to category components
// These titles MUST match exactly with the database category names
const CategoriesApi=[
    {   
        title:"Clothes",
        icon: Clothes
    },
    {   
        title:"Cars",
        icon:Cars
    },
    {   
        title:"Mobiles",
        icon:Mobiles
    },
    {
        title:"Books",
        icon:Books
    },
    {
        title:"Pets",
        icon:Pets
    },
    {   
        title:"Appliances",
        icon:Appliances
    },
    {
        title:"Toys",
        icon:Toys
    },
    {
        title:"Bikes",
        icon:Bikes
    },
    {   
        title:"Furniture",
        icon:Furniture
    }
]

export default CategoriesApi