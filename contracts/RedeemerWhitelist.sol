pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";

contract RedeemerWhitelist is Ownable {
    mapping(address => bool) redeemers;

    modifier onlyWhitelisted() {
        require(isWhitelisted(_msgSender()));
        _;
    }

    function addRedeemer(address _address) public onlyOwner {
        redeemers[_address] = true;
    }

    function removeRedeemer(address _address) public onlyOwner {
        redeemers[_address] = false;
    }

    function bulkAddRedeemers(address[] calldata _addresses) external onlyOwner {
        require(_addresses.length <= 250, "addresses count exceeds limit");
        for (uint256 i = 0; i < _addresses.length; i++) {
            redeemers[_addresses[i]] = true;
        }
    }

    function bulkRemoveRedeemers(address[] calldata _addresses) external onlyOwner {
        require(_addresses.length <= 250, "addresses count exceeds limit");
        for (uint256 i = 0; i < _addresses.length; i++) {
            redeemers[_addresses[i]] = false;
        }
    }

    function isWhitelisted(address _address) public view returns (bool) {
        return redeemers[_address];
    }
}
