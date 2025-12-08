import { environment } from "src/environments/environment.prod";


export const ApiEndPoint = {
    upload : `${environment.BASE_URL}upload`,
    product : `${environment.BASE_URL}products`,
    allProducts : `${environment.BASE_URL}products`,
    deleteProduct : `${environment.BASE_URL}products`


}