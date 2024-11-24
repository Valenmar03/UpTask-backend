import { CorsOptions } from "cors";

export const corsConfig : CorsOptions = {
    origin: function(origin, callback) {
        const whiteList = [process.env.FRONTEND_URL]

        if(process.argv[2] === '--api'){
            whiteList.push(undefined)
        }
        console.log(origin)
        console.log(whiteList)
        if(whiteList.includes(origin)){
            callback(null, true)
        }else {
            callback(new Error('CORS Error'))
        }

    }
}