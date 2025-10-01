// Mock API service for image processing
// This simulates the backend response for hardware quotation processing

export interface SubQuantity {
  color: string;
  quantity: string;
}

export interface Product {
  item_number: number;
  product_name: string;
  total_quantity: string;
  sub_quantities: SubQuantity[];
}

export interface ParsedData {
  products: Product[];
}

export interface ImageProcessingResponse {
  image_path: string;
  extracted_text: string;
  parsed_data: ParsedData;
}

// Mock data matching the provided JSON structure
const mockResponse: ImageProcessingResponse = {
  image_path: "test-images/new_image.jpeg",
  extracted_text: "```json\n{\n  \"products\": [\n    {\n      \"item_number\": 1,\n      \"product_name\": \"10 sq mm wire\",\n      \"total_quantity\": \"20 Roll\",\n      \"sub_quantities\": [\n        { \"color\": \"Red\", \"quantity\": \"5\" },\n        { \"color\": \"yellow\", \"quantity\": \"5\" },\n        { \"color\": \"Blue\", \"quantity\": \"5\" },\n        { \"color\": \"Black\", \"quantity\": \"5\" }\n      ]\n    },\n    {\n      \"item_number\": 2,\n      \"product_name\": \"6 sq mm wire\",\n      \"total_quantity\": \"12 Roll\",\n      \"sub_quantities\": [\n        { \"color\": \"Green\", \"quantity\": \"4\" },\n        { \"color\": \"Red\", \"quantity\": \"4\" },\n        { \"color\": \"Black\", \"quantity\": \"4\" }\n      ]\n    },\n    {\n      \"item_number\": 3,\n      \"product_name\": \"2.5 sq mm wire\",\n      \"total_quantity\": \"4 Roll\",\n      \"sub_quantities\": [\n        { \"color\": \"Red\", \"quantity\": \"2\" },\n        { \"color\": \"Black\", \"quantity\": \"2\" }\n      ]\n    }\n  ]\n}\n```",
  parsed_data: {
    products: [
      {
        item_number: 1,
        product_name: "10 sq mm wire",
        total_quantity: "20 Roll",
        sub_quantities: [
          { color: "Red", quantity: "5" },
          { color: "yellow", quantity: "5" },
          { color: "Blue", quantity: "5" },
          { color: "Black", quantity: "5" }
        ]
      },
      {
        item_number: 2,
        product_name: "6 sq mm wire",
        total_quantity: "12 Roll",
        sub_quantities: [
          { color: "Green", quantity: "4" },
          { color: "Red", quantity: "4" },
          { color: "Black", quantity: "4" }
        ]
      },
      {
        item_number: 3,
        product_name: "2.5 sq mm wire",
        total_quantity: "4 Roll",
        sub_quantities: [
          { color: "Red", quantity: "2" },
          { color: "Black", quantity: "2" }
        ]
      }
    ]
  }
};

/**
 * Mock function to simulate image processing API call
 * @param imageUri - URI of the uploaded image
 * @returns Promise with mock processing response
 */
export async function processImageForHardwareQuotation(imageUri: string): Promise<ImageProcessingResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Return mock data with the provided image path
  return {
    ...mockResponse,
    image_path: imageUri
  };
}

/**
 * Mock function to simulate different responses based on image content
 * This can be used to test different scenarios
 */
export async function processImageWithVariations(imageUri: string, variation: 'default' | 'empty' | 'single' = 'default'): Promise<ImageProcessingResponse> {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  if (variation === 'empty') {
    return {
      image_path: imageUri,
      extracted_text: "No products found in the image",
      parsed_data: { products: [] }
    };
  }
  
  if (variation === 'single') {
    return {
      image_path: imageUri,
      extracted_text: "```json\n{\n  \"products\": [\n    {\n      \"item_number\": 1,\n      \"product_name\": \"Single Product\",\n      \"total_quantity\": \"1 Unit\",\n      \"sub_quantities\": [\n        { \"color\": \"Standard\", \"quantity\": \"1\" }\n      ]\n    }\n  ]\n}\n```",
      parsed_data: {
        products: [
          {
            item_number: 1,
            product_name: "Single Product",
            total_quantity: "1 Unit",
            sub_quantities: [
              { color: "Standard", quantity: "1" }
            ]
          }
        ]
      }
    };
  }
  
  return processImageForHardwareQuotation(imageUri);
}
