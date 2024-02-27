import React from 'react'
import Tag from '../tag'

const CommentContent = ({ comment }) => {
    return (
        <>
            {/*<p>{JSON.stringify(this.state.selectedComment)}</p>*/}
            <p className={'text-base md:text-2xl'}>Stelling {comment?.tid}</p>
            <p
                className={
                    'text-xl lg:text-5xl leading-[1.7rem] lg:leading-[3.1rem] font-normal mt-1 mb-3 md:mb-6'
                }
                id={'comment-text'}
            >
                {comment?.txt}
            </p>
            <div className={'mb-4'}>
                <Tag>
                    Aantal stemmen: <span className={'font-medium'}>{comment?.saw}</span>
                </Tag>
            </div>
        </>
    )
}
export default CommentContent
