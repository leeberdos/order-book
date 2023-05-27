let reconcileOrder = (existingBook, incomingOrder) => {
  // create clones of arrays to keep function pure
  let activeReqs = structuredClone(existingBook)
  let newReq = structuredClone(incomingOrder)

  // create arrays
  // ONE : ANY REQUIREMENTS THAT HAD CHANGES OR ARE NEW
  // TWO : ANY REQUIREMENTS THAT ARE LEFT OVER, AND HAD NO CHANGES
  let existingBookArray = []
  let incomingOrderArray = []

  // edge cases
  // IF WE HAVE NO REQUIREMENTS RETURN AN ARRAY WITH NEW REQUIREMENTS INSIDE
  if (activeReqs.length === 0) {
    existingBookArray.push(newReq)

    return existingBookArray
  }
  // LOOK THRU ENTIRE ACTIVEREQS ARRAY AND COMPARE
  // EACH REQUIREMENT TO THE NEW REQ TO FIND ANY FULFILLMENTS
  for (let i = 0; i < activeReqs.length; i++) {
    const activeReq = activeReqs[i]

    // IF WE FIND GOOD MATCH ...
    if (reqTypeMatch(newReq, activeReq) && reqPriceMatch(newReq, activeReq)) {
    // THEN FULFILL REQUIREMENT
      const procuredReq = fulfillOrder(newReq, activeReq)

      // THEN PUSH RESULTING OBJECT INTO EXISTING BOOK ARRAY
      // if the resulting object still has anything left to give
      if (procuredReq.quantity > 0) {
        existingBookArray.push(procuredReq)
      }
    } else {
      // IF WE DO NOT FIND A MATCH, PUSH THE CURRENT ITEM INTO INCOMINGORDER ARRAY
      incomingOrderArray.push(activeReq)
    }
  }
  // IF WE STILL HAVE NEWREQUIREMENT LEFT OVER PUSH IT INTO THE EXISTINGBOOK ARRAY
  if (newReq.quantity > 0) {
    existingBookArray.push(newReq)
  }
  // COMBINE OUR EXISTINGBOOK AND INCOMINGORDER ARRAYS IN ORDER
  let returnArray = [...incomingOrderArray, ...existingBookArray]

  // RETURN RESULTING ARRAY
  return returnArray
}

const fulfillOrder = (newReq, activeReq) => {
  const procurementQty = getProcurementQty(newReq, activeReq)

  activeReq.quantity -= procurementQty
  newReq.quantity -= procurementQty

  return activeReq
}

// helper functions
const reqTypeMatch = (newReq, activeReq) => newReq.type !== activeReq.type

const reqPriceMatch = (newReq, activeReq) => newReq.price === activeReq.price

const getProcurementQty = (newReq, activeReq) => Math.min(newReq.quantity, activeReq.quantity)


module.exports = reconcileOrder