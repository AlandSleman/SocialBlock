/** @format */

import * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { getDate } from "../utils/get-date-moment";
const Transaction = anchor.web3.Transaction;
import { Comment, AccountData } from "./comment";

interface CommentProps {
    commentProgram: anchor.Program<anchor.Idl>
    postPubkey: PublicKey
    walletPubkey: PublicKey
    username: string
    content: string
}
export const newComment = async ({
    commentProgram,
    postPubkey,
    walletPubkey,
    username,
    content,
}: CommentProps) => {
    const newCommentAccount = anchor.web3.Keypair.generate();
    let result = await commentProgram.methods
        .newComment(postPubkey, username, content)
        .accounts({
            comment: newCommentAccount.publicKey,
            author: walletPubkey,
        })
        .signers([newCommentAccount])
        .rpc();


    const newCommentAccount0: any = {
        authorDisplay: walletPubkey.toBase58(),
        postPubkey: postPubkey,
        publicKey: newCommentAccount.publicKey,
        createdAgo:getDate(Date.now()/1000),
        content,
        username,
    };
    return newCommentAccount0
};
export const getAllComments = async ({ program, publicKey }: { program: any, publicKey: string }) => {



    const postsRaw = await program.account.comment.all([pubkeyFilter(publicKey)]);

    const posts = postsRaw.map((t: any) => new Comment(t.publicKey, t.account));
    return posts;
};
const pubkeyFilter = (publicKey: any) => ({
    memcmp: {
        offset: 40, // Discriminator.
        bytes: publicKey,
    },
});
