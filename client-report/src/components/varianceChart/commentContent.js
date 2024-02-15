import React from 'react'
import Tag from '../tag'

const CommentContent = ({ comment }) => {
    return (
        <>
            {/*<p>{JSON.stringify(this.state.selectedComment)}</p>*/}
            <p className={'text-2xl'}>Stelling {comment?.tid}</p>
            <p className={'text-5xl font-medium mt-1 mb-6'}>{comment?.txt}</p>
            <div className={'mb-4'}>
                <Tag>
                    Aantal stemmen: <span className={'font-semibold'}>{comment?.saw}</span>
                </Tag>
            </div>
        </>
    )
}
export default CommentContent