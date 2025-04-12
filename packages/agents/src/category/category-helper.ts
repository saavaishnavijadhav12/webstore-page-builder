import { ICategory, IMegaMenuCategory } from "@znode/types/category";

export const mapCategoryList = (categories: IMegaMenuCategory[]): IMegaMenuCategory[] => {
  return categories.map((category: IMegaMenuCategory) => {
    return {
      hasSubCategories: category.subCategories && category.subCategories.length > 0,
      publishCategoryId: category?.publishCategoryId,
      name: category?.name,
      categoryUrl: category.seoDetails?.seoPageName ? `/${category.seoDetails.seoPageName}` : `/category/${category.publishCategoryId}`,
      dataTestSelector: `${category.name.replace(/\s/g, "")}${category.publishCategoryId}`,
      subCategories: category?.subCategories && category.subCategories.length ? mapCategoryList(category.subCategories) : [],
    };
  }) as IMegaMenuCategory[];
};

export const mapCategoryData = (category: ICategory) => {
  const categoryUrl = category?.seoUrl ? "/" + category.seoUrl : `/category/${category?.publishCategoryId}`;
  return {
    categoryUrl,
    categoryName: category.categoryName,
    imageSmallPath: category.imageSmallPath,
    categoryCode: category.categoryCode,
  };
};
