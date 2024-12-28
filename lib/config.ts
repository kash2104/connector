const cloudinary = require('cloudinary').v2;

export async function deleteFromCloud(publicId: string, resource_type:string){
    return await cloudinary.uploader.destroy(publicId,{resource_type: resource_type}, {invalidate: true});
}

interface CloudinaryUploadResultImage {
    public_id: string;
    [key: string]: any
}

export async function uploadImage(file:any, folder:any){
   
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<CloudinaryUploadResultImage>(
        (resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {folder: folder},
                (error:any, result:any) => {
                    if(error) reject(error);
                    else resolve(result as CloudinaryUploadResultImage);
                }
            )
            uploadStream.end(buffer)
        }
    )

    return result;
    
}

interface CloudinaryUploadResultVideo {
    public_id: string;
    bytes: number;
    duration?: number
    [key: string]: any
}

export async function uploadVideo(file:any, folder:any){

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const result = await new Promise<CloudinaryUploadResultVideo>(
        (resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: "video",
                    folder: folder,
                    transformation: [
                        {quality: "auto", fetch_format: "mp4"},
                    ]
                },
                (error:any, result:any) => {
                    if(error) reject(error);
                    else resolve(result as CloudinaryUploadResultVideo);
                }
            )
            uploadStream.end(buffer)
        }
    )

    return result;

}

export async function cloudConnect(){
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.CLOUD_API_KEY,
            api_secret: process.env.CLOUD_API_SECRET
        })
    } catch (error: any) {
        console.error("Error connecting to cloudinary", error.message);

    }
}