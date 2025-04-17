export const fetchOBFData = async (ean) => {
    try {
      const res = await fetch(`https://world.openbeautyfacts.org/api/v0/product/${ean}.json`)
      if (!res.ok) return null
      const data = await res.json()
      return data.product || null
    } catch (err) {
      console.error("OBF fetch error:", err)
      return null
    }
  }
  
  export const getBestOBFImage = (product) => {
    if (!product) return null
    const options = [
      product.images?.front?.display?.fr,
      product.image_front_url,
      product.image_url,
      product.image_front_small_url,
    ]
    return options.find((url) => typeof url === "string") || null
  }
  