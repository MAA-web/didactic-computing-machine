

export default function Page({ params }: { params: { slug: string } }) {
    return (<>
    
    <div>My Post: {params.slug}</div>
    <br />
    <p>specific event page</p>
        <br />
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat sit consequuntur molestiae eaque iusto velit quisquam, dolor, tenetur minus, distinctio et necessitatibus. Sed, dicta ducimus id dolorem non voluptate laudantium.
        </p>
    </>)
}