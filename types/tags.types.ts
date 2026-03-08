export interface Tag {
  id: string;
  name: string;
}

export interface TagsResponse {
  success: true;
  tags: Tag[];
}
