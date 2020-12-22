import image from '../models/image'

export default {
    render (image: image) {
        return{
            id: image.id,
            url: `http://localhost:3333/uploads/${image.path}`
        }
    },
    renderMany(images: image[]) {
        return images.map(image => this.render(image))
    }
}