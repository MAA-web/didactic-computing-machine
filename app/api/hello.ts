export default function handler(req: Request, res: Response):void {
    res.status(200).json({name: 'John Doe'})
}