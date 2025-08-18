export default interface PostAttributes {
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  coverImageDescription: string;
  thumbnail: string;
  thumbnailDescription: string;
  tags: string[];
  shadowColor: string;
  date: string;
  draft: boolean;
}
