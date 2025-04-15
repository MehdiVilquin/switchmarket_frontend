import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";

function SearchCard(props) {
  if (!props.product) {
    return null;
  }

  const ingredientsCount = props.product.ingredients?.length || 0;
  const additivesCount = props.product.additives?.length || 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <h3 className="text-lg font-bold">
          {props.product.product_name || "N/A"}
        </h3>
        <p className="text-sm text-gray-500">
          {props.product.brands || "Unknown brand"}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Ingredients:</span>
            <Badge variant="secondary">{ingredientsCount}</Badge>
          </div>

          {props.product.labeltags && props.product.labeltags.length > 0 && (
            <div className="space-y-2">
              <span>Labels:</span>
              <div className="flex flex-wrap gap-2">
                {props.product.labeltags.map((label, index) => (
                  <Badge key={index} variant="outline">
                    {label}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span>Completion Score:</span>
            <Badge variant="secondary">
              {props.product.completion_score || "N/A"}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span>Additives:</span>
            <Badge variant="secondary">{additivesCount}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default SearchCard;