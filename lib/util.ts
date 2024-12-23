const cloudinary = require('cloudinary').v2;

export async function deleteFromCloud(publicId: string){
    return await cloudinary.uploader.destroy(publicId, {invalidate: true});
}

export async function uploadToCloud(file:any, folder:any){
    const {options} = folder;
    options.resource_type = "auto";

    options.max_bytes = 2*1024*1024*1024; // 2GB

    return await cloudinary.uploader.upload_large(file.tempFilePath, options);
}