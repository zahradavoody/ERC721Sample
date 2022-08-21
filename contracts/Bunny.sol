pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./RedeemerWhitelist.sol";


//sample contracts
// https://etherscan.io/address/0x14e0a1f310e2b7e321c91f58847e98b8c802f6ef#code

contract Bunny is ERC721Enumerable, RedeemerWhitelist {
    using SafeMath for uint256;

    uint256 private tokenId = 1;
    uint256 private redeemRemainSupply = 250;

    bool public mintOpened;
    bool public redeemOpened;

    //todo set correct url
    string public baseURI = "http://api.bunny.example.com/";

    constructor() ERC721("BunnyNFT", "BNY") {
    }

    function start() external onlyOwner {
        mintOpened = true;
    }

    function setBaseURI(string memory _baseUri) external onlyOwner {
        baseURI = _baseUri;
    }

    function _baseURI() override internal view virtual returns (string memory) {
        return baseURI;
    }

    function redeemMint(uint _count) external onlyWhitelisted {
        require(redeemOpened, "redeem is not active");
        require(redeemRemainSupply >= _count, "invalid count");

        for (uint i = 0; i < _count; i++) {
            _safeMint(_msgSender(), tokenId);
            tokenId++;
        }
        redeemRemainSupply = redeemRemainSupply.sub(_count);
    }

    function toggleRedeemOpened() external onlyOwner {
        redeemOpened = !redeemOpened;
    }

    function mint(uint256 _count) external payable {
        require(mintOpened, "minting is not started");
        // check if count <= 20
        require(_count <= 20, "max count is 20");
        // check if tx.value is correct
        require(0.055 ether * (_count) <= msg.value, "invalid value");
        // check if total supply is not reaching max total supply after mint
        require(totalSupply().add(_count) <= 9750, "reached max supply");

        for (uint i = 0; i < _count; i++) {
            _safeMint(_msgSender(), tokenId);
            tokenId++;
        }
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

}
