export default interface PostAttributes {
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  coverImageMedium: string;
  coverImageSmall: string;
  coverImageDescription: string;
  metaImage: string;
  metaImageDescription: string;
  thumbnail: string;
  thumbnailDescription: string;
  icon: string;
  iconDescription: string;
  tags: string[];
  shadowColor: string;
  date: string;
  lastMod?: string;
  draft: boolean;
}
