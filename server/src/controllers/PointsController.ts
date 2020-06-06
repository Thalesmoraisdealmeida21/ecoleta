import knex from '../database/connection'
import {Request, Response} from 'express'

class PointsController {
  async show(request: Request, response: Response){
      const idPoint = request.params.id


      const point = await knex('points').where('id', idPoint).first();

      if(!point){
        return response.status(400).json({message: 'Point not found :('})
      } 

      const items = await knex('items').join('points_items', 'items.id', '=', 'points_items.item_id')
      .where('points_items.point_id', idPoint).select('title');

      const serializedPoint = {
            ...point,
            image_url: `http://192.168.0.108:3333/uploads/${point.image}`
      }

      return response.status(200).json({serializedPoint, items})
    }

  async create(request: Request, response: Response){
    const {
      name,
      email, 
      whatsapp, 
      latitude,
      longitude,
      city,
      uf, 
      items
    } = request.body;




   const point = {
      image: request.file.filename,
      name,
      email, 
      whatsapp, 
      latitude,
      longitude,
      city,
      uf,
    }





  const id = await knex('points').insert(point).returning('id')



   const pointItems = await items
    .split(',')
    .map((item: string) => Number(item.trim()))
    .map((item_id: number)=>{
      return{
        item_id,
        point_id: id[0]
      }
    })

    
    await knex('points_items').insert(pointItems)

    return response.json({
      id: id[0],
      ...point,
    });
}

async index(request: Request, response: Response){
    const  {city, uf, items} = request.query;


    const parsedItems = String(items).split(',').map(item=> Number(item.trim()));

      
    const points = await knex('points').join('points_items', 'points.id', '=', 'points_items.point_id')
    .whereIn('points_items.item_id', parsedItems)
    .where('city', String(city))
    .where('uf', String(uf))
    .distinct()
    .select('points.*');

    const serializedPoints = points.map(point => {
      return{
        ...point,
        image_url: `http://192.168.0.108:3333/uploads/${point.image}`
    }
     
    })


    return response.json(serializedPoints)
}



}

export default PointsController;