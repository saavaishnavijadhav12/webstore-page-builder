import { ICategory } from "@znode/types/category";
import { WebStoreCategoryModel } from "@znode/clients/v1";

export const mapCategories = (categories: WebStoreCategoryModel[]) => {
  const categoryList =
    categories.map((category) => ({
      categoryCode: category.CategoryCode,
      name: category.Name,
      seoDetails: {
        seoDescription: category?.SEODetails?.SEODescription,
        seoKeywords: category?.SEODetails?.SEOKeywords,
        seoTitle: category?.SEODetails?.SEOTitle,
        seoPageName: category.SEODetails?.SEOPageName,
      },
      publishCategoryId: category.PublishCategoryId,
      subCategories: category?.SubCategories && category?.SubCategories.length ? mapCategories(category?.SubCategories) : [],
      seoPageName: category.SEODetails?.SEOPageName,
    })) as ICategory[];

  return categoryList;
};
