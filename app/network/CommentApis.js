'use strict';

import { postData } from './utils/Http';

export function createComment(comment_model, mentioned_users, mentioned_deps) {
  return postData('createComment', {
    CommentModel: comment_model,
    MentionedUsers: mentioned_users,
    MentionedDeps: mentioned_deps
  });
}
  export function removeComment(comment_id) {
    return postData('removeComment', {
      CommentId: comment_id
    })
  }
